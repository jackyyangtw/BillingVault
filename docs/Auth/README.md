# Auth 認證流程

這個專案使用 Supabase Auth 做登入與 session 管理，Next.js 只負責把認證流程接好、保護頁面、以及把安全相關邏輯放在 server 端。

簡單講：

- 使用者用 email / password 登入
- Supabase 建立 session，並發出 access token 與 refresh token
- `@supabase/ssr` 把 session 存在 cookie 裡
- Proxy 會協助刷新快過期的 token
- 受保護頁面會在 server 端用 `getUser()` 確認使用者真的還有效

## 重要檔案

| 檔案                                | 用途                                                |
| ----------------------------------- | --------------------------------------------------- |
| `src/app/(public)/login/actions.ts` | 登入用的 Server Action                              |
| `src/actions/logout.ts`             | 登出用的 Server Action                              |
| `src/lib/supabase/env.ts`           | 讀取 Supabase URL 與 publishable key                |
| `src/lib/supabase/client.ts`        | 建立 browser Supabase client                        |
| `src/lib/supabase/server.ts`        | 建立 server Supabase client                         |
| `src/lib/auth/dal.ts`               | Server 端的 Auth Data Access Layer                  |
| `src/proxy.ts`                      | Next.js Proxy，負責路由守衛與 CSP                   |
| `src/proxy/supabaseProxy.ts`        | Proxy 內的 Supabase session refresh 邏輯            |
| `src/providers/AuthProvider.tsx`    | 把 server 取得的非敏感使用者資料同步到 client store |
| `src/stores/auth-store.ts`          | Client UI 使用的非敏感 auth 狀態                    |

## 登入流程

登入入口在 `src/app/(public)/login/actions.ts`。

流程如下：

1. 使用者送出 email、password、可選的 `callbackUrl`
2. `loginFormSchema` 驗證表單格式
3. `createSupabaseServerClient()` 建立 server-side Supabase client
4. 呼叫 `supabase.auth.signInWithPassword()`
5. Supabase 登入成功後，`@supabase/ssr` 會把 session 寫進 cookie
6. 登入成功後導向 `callbackUrl`，如果沒有就導向 `/account/billing`

`callbackUrl` 會經過 `isSafeCallbackUrl()` 檢查，只允許同站相對路徑，避免 open redirect。

## 登出流程

登出入口在 `src/actions/logout.ts`。

流程如下：

1. 建立 server-side Supabase client
2. 呼叫 `supabase.auth.signOut()`
3. Supabase 會撤銷 refresh token
4. 使用者被導回 `/`

注意：access token 是 JWT，已發出的 access token 會活到自己的 `exp` 到期。這也是為什麼受保護頁面要用 `getUser()` 做 server-side 權威驗證。

## 受保護頁面如何驗證

受保護頁面目前包含：

- `/checkout`
- `/account`

路由設定在 `src/proxy/routes.ts`。

真正的權威驗證在 `src/lib/auth/dal.ts`：

```ts
export const verifySession = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return { isAuth: true as const, userId: user.id, user };
});
```

這裡刻意使用 `getCurrentUser()`，而 `getCurrentUser()` 內部使用：

```ts
supabase.auth.getUser();
```

原因是 `getUser()` 會向 Supabase Auth server 確認目前 session / user 是否仍有效。這比只解 JWT 的 `getClaims()` 更適合作為受保護頁面的權威驗證。

## Proxy 做什麼

`src/proxy.ts` 是 Next.js 16 的 Proxy。它主要做三件事：

1. 建立 CSP nonce
2. 用 Supabase session 判斷是否要 redirect
3. 協助 Supabase refresh token cookie

Proxy 裡的 Supabase 邏輯在 `src/proxy/supabaseProxy.ts`。

這裡使用：

```ts
supabase.auth.getClaims();
```

它的角色是「快速判斷與觸發 token refresh」，不是最終授權依據。

受保護頁面的真正安全檢查仍然在 `verifySession()`，也就是 `getUser()`。

## Access Token 與 Refresh Token

Supabase 登入後會有兩種 token：

| Token         | 用途                                |
| ------------- | ----------------------------------- |
| Access token  | 短效 JWT，用來代表目前使用者        |
| Refresh token | 長效 token，用來換新的 access token |

Access token 通常有效時間較短。Supabase 官方常見建議是使用預設值，通常是 1 小時；不建議設定太短，例如低於 5 分鐘，因為會造成 refresh 過於頻繁，也可能因為時間誤差導致問題。

Refresh token 通常不需要自己手動實作。這個專案使用 `@supabase/ssr`，它會透過 cookie adapter 自動處理 token 讀取、刷新與寫回。

## Cookie 如何運作

Server client 在 `src/lib/supabase/server.ts`：

```ts
return createServerClient(url, publishableKey, {
  cookies: {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        cookieStore.set(name, value, options);
      });
    },
  },
});
```

Proxy client 在 `src/proxy/supabaseProxy.ts`：

```ts
cookiesToSet.forEach(({ name, value, options }) => {
  nextResponse.cookies.set(name, value, options);
});
```

Server Components 不能穩定寫 cookie，所以 token refresh 主要交給 Proxy 完成。

## 為什麼不是 HttpOnly Cookie

Supabase SSR 的 browser client 需要讀取 session token，才能在瀏覽器端維持登入狀態與 refresh session。

因此這類 Next.js rich UI app 通常不會把 Supabase auth cookie 設成 HttpOnly。

這代表主要風險是 XSS：

- 如果網站出現 XSS，攻擊者的 JavaScript 可能讀到 auth token
- 如果 refresh token 被偷，攻擊者可能嘗試接管 session
- 第三方 script 來源需要非常謹慎

這個專案目前用 CSP nonce 降低風險，但仍應避免加入不必要的第三方 script。

## Client Auth Store 的定位

`src/stores/auth-store.ts` 只給 UI 使用。

它可以拿來顯示：

- Navbar 是否顯示登入狀態
- 使用者名稱
- 使用者 email
- avatar

它不能拿來做安全判斷。

安全判斷一定要在 server 端做，例如：

- Server Component
- Server Action
- Route Handler
- DAL

不要相信 client 傳來的 `userId`、權限、價格、訂單狀態。

## 安全規則

這個專案的 Auth 安全規則：

1. 受保護頁面使用 `verifySession()`
2. 權威驗證使用 `getUser()`，不要只靠 `getClaims()`
3. `getClaims()` 可以用在 Proxy 做快速 redirect 或 refresh，不作為最終授權
4. Client store 只存非敏感資料
5. 不在前端暴露 `service_role` 或 secret key
6. 敏感資料查詢與 mutation 放在 server 端
7. `callbackUrl` 必須檢查，避免 open redirect
8. 權限資料不要放在 `user_metadata`
9. 如果未來直接從 browser 查 Supabase table，必須先確認 RLS policy 安全

## 常見修改方式

### 新增受保護頁面

1. 把路由 prefix 加到 `src/proxy/routes.ts`
2. 在該路由的 layout 或 page 呼叫 `verifySession()`
3. 不要只依賴 client store 判斷登入狀態

### 新增需要登入的 Server Action

Server Action 開頭先做：

```ts
const { user } = await verifySession();
```

接著使用 `user.id` 作為 server-side 信任的使用者 id。

不要從表單或 client state 接收 `userId` 當作可信資料。

### 需要目前使用者資料但不強制登入

使用：

```ts
const user = await getCurrentUser();
```

如果回傳 `null`，代表目前沒有有效登入。

## 官方參考

- Supabase sessions: https://supabase.com/docs/guides/auth/sessions
- Supabase SSR advanced guide: https://supabase.com/docs/guides/auth/server-side/advanced-guide
- Supabase JWTs: https://supabase.com/docs/guides/auth/jwts
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
