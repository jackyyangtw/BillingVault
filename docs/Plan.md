# SecureCart 專案計畫

## 專案定位

**SecureCart** 是一個以 **SaaS 訂閱結帳流程** 為核心的 Next.js side project。

這不是一般商品商城，而是用來展示：

- 安全的登入驗證流程（Supabase Auth Email 登入）
- SaaS 訂閱方案
- 結帳流程
- 模擬付款 / 信用卡綁定
- 訂閱管理
- 帳單紀錄
- 表單驗證
- 以資安為核心的前端架構
- 可維護的 Next.js App Router 結構

## 專案一句話描述

```txt
A secure SaaS subscription checkout demo built with Next.js App Router.
```

## GitHub 描述

```txt
A secure SaaS subscription checkout demo built with Next.js App Router, featuring pricing plans, mock payment flow, subscription management, billing history, form validation, and security-focused frontend architecture.
```

---

## 為什麼選 SaaS 訂閱，而不是一般商城？

| 項目            | 一般實體商城 | SaaS 訂閱服務 |
| --------------- | ------------ | ------------- |
| 商品列表        | 重要         | 次要          |
| 物流 / 庫存     | 重要         | 不需要        |
| 結帳流程        | 重要         | 非常重要      |
| 綁卡 / 付款方式 | 重要         | 非常重要      |
| 訂閱升降級      | 少見         | 核心功能      |
| 取消訂閱        | 少見         | 核心功能      |
| 帳單紀錄        | 普通         | 核心功能      |
| 權限控管        | 普通         | 很適合展示    |
| 試用 / 方案切換 | 少見         | 很適合展示    |
| 資安流程        | 可做         | 更合理        |

**結論：**  
SaaS 訂閱商城更能展示真實商業產品中的前端架構能力，而不只是購物車 UI。

---

## 產品方向

SecureCart 可以想像成一個「安全 SaaS 訂閱結帳平台」，販售開發者工具或團隊軟體服務。

## 建議販售的 SaaS 產品

| 產品名稱        | 說明                           | 月費   |
| --------------- | ------------------------------ | ------ |
| **CodeGuard**   | 依賴套件安全掃描與 CI 風險警告 | $19/mo |
| **DeployWatch** | 部署監控與版本發布追蹤         | $15/mo |
| **ErrorPulse**  | 前端錯誤追蹤與 Session 診斷    | $29/mo |
| **MetricFlow**  | 產品分析與轉換率儀表板         | $39/mo |
| **TeamVault**   | 安全團隊工作區與存取控制       | $49/mo |

---

## 訂閱方案設計

| 方案           | 適合對象   | 價格     | 功能                             |
| -------------- | ---------- | -------- | -------------------------------- |
| **Starter**    | 個人開發者 | $9/mo    | 1 個專案、基本分析、Email 支援   |
| **Pro**        | 小團隊     | $29/mo   | 5 個專案、進階報表、Webhook 警告 |
| **Business**   | 公司團隊   | $99/mo   | 無限專案、團隊角色、稽核紀錄     |
| **Enterprise** | 大型組織   | 洽詢報價 | SSO、客製 SLA、專屬支援          |

---

## MVP 功能範圍

| 狀態 | 優先級 | 功能            | 說明                                                  |
| ---- | ------ | --------------- | ----------------------------------------------------- |
| ✅   | P0     | 訂閱方案頁      | 顯示 Starter / Pro / Business / Enterprise 方案       |
| 🟡   | P0     | 真實 Email 登入 | 使用 Supabase Auth Email/Password；僅保留一組測試帳號 |
| ✅   | P0     | 結帳流程        | 選方案、填寫帳務資料、TapPay 信用卡欄位、送出訂閱     |
| ✅   | P0     | 帳務頁面        | 顯示目前方案、付款方式與帳務資訊                      |
| ✅   | P0     | 訂閱狀態        | active / trialing / past_due / canceled               |
| ✅   | P1     | 升級 / 降級     | 方案升級與降級流程 UI                                 |
| ✅   | P1     | 取消訂閱        | 取消訂閱流程與確認彈窗                                |
| 🟡   | P1     | TapPay 付款方式 | 結帳頁已串 TapPay hosted fields；管理頁尚待接入       |
| ✅   | P1     | 帳單紀錄        | 帳單紀錄與付款狀態                                    |
| ⬜   | P2     | 團隊席位        | 團隊成員與席位計費                                    |
| ⬜   | P2     | 稽核紀錄        | 帳務與安全操作紀錄                                    |

---

## 頁面規劃

| 狀態 | Route                   | 頁面       | 功能                              |
| ---- | ----------------------- | ---------- | --------------------------------- |
| ✅   | `/`                     | 首頁       | 產品介紹與 CTA                    |
| ✅   | `/pricing`              | 方案頁     | 方案比較、月繳 / 年繳切換         |
| ✅   | `/product/[id]`         | 產品詳情頁 | SaaS 產品介紹與方案導流           |
| 🟡   | `/login`                | 登入頁     | Supabase Auth Email/Password 登入 |
| ✅   | `/checkout`             | 結帳頁     | 選方案、帳務資料、TapPay 欄位     |
| ✅   | `/checkout/success`     | 結帳成功頁 | 成功結果                          |
| ✅   | `/checkout/failure`     | 結帳失敗頁 | 失敗結果                          |
| ✅   | `/account/billing`      | 帳務頁     | 目前方案、付款方式、帳單摘要      |
| ✅   | `/account/subscription` | 訂閱管理頁 | 升級、降級、取消訂閱              |
| 🟡   | `/account/payment`      | 付款方式頁 | 付款方式列表；TapPay 新增卡待接入 |
| ⬜   | `/account/team`         | 團隊管理頁 | 席位、成員、角色權限              |
| ⬜   | `/account/security`     | 安全設定頁 | 登入紀錄、安全設定                |
| ⬜   | `/dashboard`            | 儀表板     | 訂閱後的產品使用狀態              |

---

## 技術棧

| 類型         | 技術 / 現況                                           |
| ------------ | ----------------------------------------------------- |
| 框架         | Next.js 16 App Router                                 |
| React        | React 19 + React Compiler                             |
| 程式語言     | TypeScript                                            |
| 套件管理工具 | pnpm                                                  |
| 樣式         | Tailwind CSS v4 + shadcn/ui                           |
| 表單         | React Hook Form                                       |
| 驗證         | Zod                                                   |
| 驗證服務     | Supabase Auth（Email/Password only）                  |
| 伺服器狀態   | TanStack Query                                        |
| 客戶端狀態   | Zustand                                               |
| 付款 SDK     | TapPay Web SDK hosted fields                          |
| 外部狀態訂閱 | `useSyncExternalStore` 管理 TapPay card status        |
| 測試         | Vitest                                                |
| 資安         | CSP nonce、safe callback URL、Supabase session cookie |
| CI           | 尚待規劃                                              |

---

## 目前專案架構

```txt
src/
  actions/

  app/
    (public)/
      page.tsx
      (home)/
      pricing/
        page.tsx
      product/[id]/
        page.tsx
      login/
        page.tsx
        actions.ts
        schema.ts

    (protected)/
      layout.tsx
      _components/
        ProtectedSidebar.tsx
        ProtectedTopbar.tsx

      checkout/
        page.tsx
        success/page.tsx
        failure/page.tsx
        _components/CheckoutForm/
          index.tsx
          BillingInfoCard.tsx
          PlanSelector.tsx
          PaymentMethodCard/
            index.tsx
            TapPayHostedField.tsx

      account/
        layout.tsx
        billing/page.tsx
        subscription/page.tsx
        payment/page.tsx

    _components/layout/
      Navbar/
      Footer.tsx

  components/
    ui/

  providers/
    AuthProvider.tsx
    QueryProvider.tsx
    ThemeProvider.tsx
    tappay/
      index.tsx
      tappay.ts
      cardStatusStore.ts

  lib/
    auth/
    supabase/
    tailwind-css/

  proxy/
    buildCspHeader.ts
    isSafeCallbackUrl.ts

  settings/
    csp.ts

  stores/
    auth-store.ts

  mocks/
    fixtures/

prisma/
  schema.prisma

docs/
  Components/
  Form/
```

### 重要結構變更紀錄

- Route 結構採用 `(public)` / `(protected)` route groups。
- Protected route group 透過 `src/app/(protected)/layout.tsx` 掛上 TapPay provider。
- TapPay SDK、hosted fields 設定、prime 取得與 card status external store 集中在 `src/providers/tappay/`，不放在 `app/` 內。
- Checkout 的付款卡元件已依 200 行規則拆為 `PaymentMethodCard/index.tsx` 與 `TapPayHostedField.tsx`。
- 跨多層目錄的 import 使用 `@/` alias；相對路徑最多保留到 `../../`。
- 登入流程下一步改為 Supabase Auth Email/Password；先不做 OAuth、不開放註冊，只使用一組測試帳號完成真實 session flow。

---

## Supabase Auth 登入規劃

### MVP 範圍

| 狀態 | 項目         | 說明                                                      |
| ---- | ------------ | --------------------------------------------------------- |
| 🟡   | Email 登入   | `/login` 使用 Supabase Auth `signInWithPassword`          |
| 🟡   | Session 管理 | 使用 Supabase SSR cookie flow，server-side 讀取目前使用者 |
| 🟡   | 登出         | 呼叫 Supabase Auth `signOut` 後導回首頁或登入頁           |
| 🟡   | 測試帳號     | 僅建立一組測試帳號，供 demo / 面試展示使用                |
| ⬜   | 註冊         | MVP 不開放註冊，避免 demo 使用者自行建立帳號              |
| ⬜   | OAuth        | MVP 不接 Google / Facebook / LINE，保留為後續擴充         |

### 測試帳號策略

```txt
Email: demo@securecart.dev
Password: 由 Supabase Dashboard 建立與管理，不提交到 repo
```

- 測試帳號只存在於 Supabase Auth。
- `.env.local` 僅保存 Supabase URL / anon key 等環境變數。
- 文件與程式碼不硬編碼測試密碼。
- 登入 UI 可提示「使用專案提供的 demo 帳號」，但不在公開 repo 暴露密碼。

### 實作方向

| 模組                                | 說明                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| `src/lib/supabase/client.ts`        | Client Component 使用的 Supabase browser client             |
| `src/lib/supabase/server.ts`        | Server Action / Server Component 使用的 server client       |
| `src/app/(public)/login/actions.ts` | 改用 Supabase Auth email/password 登入                      |
| `src/actions/logout.ts`             | 改用 Supabase Auth signOut                                  |
| `src/lib/auth/dal.ts`               | 改由 Supabase session 取得目前使用者                        |
| `src/proxy.ts`                      | 維持快速樂觀檢查與 safe callback URL，不做完整 session 驗證 |

---

## Mock API 規劃

> 登入將改為 Supabase Auth；Mock API 保留給 pricing、checkout、subscription、invoice 等尚未接後端的產品資料流程。

| 狀態 | API                             | 方法 | 說明                         |
| ---- | ------------------------------- | ---- | ---------------------------- |
| ❌   | `/api/auth/login`               | POST | 不再規劃；改用 Supabase Auth |
| ❌   | `/api/auth/logout`              | POST | 不再規劃；改用 Supabase Auth |
| ⬜   | `/api/pricing/plans`            | GET  | 取得方案列表                 |
| ⬜   | `/api/checkout`                 | POST | 建立訂閱                     |
| ⬜   | `/api/subscription/current`     | GET  | 取得目前訂閱狀態             |
| ⬜   | `/api/subscription/change-plan` | POST | 升級 / 降級方案              |
| ⬜   | `/api/subscription/cancel`      | POST | 取消訂閱                     |
| ⬜   | `/api/payment-methods`          | GET  | 取得付款方式                 |
| ⬜   | `/api/payment-methods`          | POST | 新增付款方式                 |
| ⬜   | `/api/invoices`                 | GET  | 取得帳單紀錄                 |
| ⬜   | `/api/team/members`             | GET  | 取得團隊成員                 |

---

## 訂閱狀態設計

```ts
type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";
```

| 狀態         | UI 顯示                    |
| ------------ | -------------------------- |
| `trialing`   | 試用中，顯示剩餘天數       |
| `active`     | 訂閱正常                   |
| `past_due`   | 付款失敗，需要更新付款方式 |
| `canceled`   | 已取消訂閱                 |
| `incomplete` | 訂閱尚未完成               |

---

## 付款流程設計

```txt
選擇方案
  ↓
建立結帳 Session
  ↓
填寫帳務資訊
  ↓
TapPay hosted fields 驗證信用卡
  ↓
取得 TapPay prime
  ↓
確認訂閱
  ↓
顯示結果
```

## 結帳流程頁面步驟

| 步驟        | 說明                          |
| ----------- | ----------------------------- |
| 1. 選擇方案 | 選擇 Starter / Pro / Business |
| 2. 帳務資訊 | 填寫帳務資訊                  |
| 3. 付款方式 | TapPay hosted fields / prime  |
| 4. 確認訂單 | 確認方案、價格、付款方式      |
| 5. 結果     | 成功 / 失敗 / 處理中          |

---

## 資安展示點

| 功能             | 展示內容                                |
| ---------------- | --------------------------------------- |
| 安全回調 URL     | 防止外站 redirect                       |
| CSP nonce        | 展示基本 CSP header 設計                |
| Supabase Session | 使用 Supabase Auth 管理 session cookie  |
| 表單驗證         | 所有表單使用 Zod schema                 |
| 錯誤碼對應       | 後端 error code 對應 i18n 訊息          |
| 送出鎖定         | 避免重複送出付款                        |
| 冪等鍵概念       | 避免重複建立訂閱                        |
| 受保護路由       | account / checkout / dashboard 需要登入 |
| Session 過期處理 | Session 過期時自動導回登入頁            |

---

## 測試項目

| 狀態 | 測試目標      | 範例                                                 |
| ---- | ------------- | ---------------------------------------------------- |
| ✅   | 安全回調 URL  | 擋掉 `https://evil.com`、`javascript:`、`//evil.com` |
| ✅   | CSP header    | nonce、TapPay script/frame 白名單                    |
| ⬜   | Supabase Auth | email/password 登入、登出、session 過期              |
| ⬜   | 價格計算      | 月繳 / 年繳折扣計算                                  |
| ⬜   | 方案比較      | 不同方案功能顯示                                     |
| ⬜   | 訂閱狀態      | 不同狀態顯示正確 UI                                  |
| ⬜   | 結帳驗證      | 必填欄位、格式錯誤                                   |
| 🟡   | TapPay 付款   | hosted fields 驗證、prime 取得、成功 / 失敗流程      |
| ⬜   | 帳單格式化    | 金額、日期、狀態格式化                               |

---

## README 可以強調的技術決策

| 主題                         | 說明                                             |
| ---------------------------- | ------------------------------------------------ |
| 為何選 SaaS 訂閱             | 比一般商城更適合展示帳務、訂閱、付款與權限流程   |
| 為何用 Supabase Auth         | 以最小後端成本展示真實 Email 登入與 session flow |
| 為何用 Route Handler 模擬    | 非 auth 資料暫不依賴真後端，但保留真實 API flow  |
| 為何使用 session cookie      | 避免 token 暴露於 client-side JavaScript         |
| 為何用 Zod + React Hook Form | 集中管理表單驗證與型別                           |
| 為何用 TanStack Query        | 管理 server state、loading、error、retry         |
| 為何用 Zustand               | 管理少量 client-side 結帳 / UI 狀態              |
| 為何做安全回調 URL           | 避免 open redirect                               |
| 為何實作 CSP                 | 展示基本資安 header 意識                         |
| 為何集中 TapPay Provider     | SDK 初始化與 card status store 不混入 app route  |
| 為何要寫測試                 | 驗證付款、callback、價格、訂閱狀態等核心邏輯     |

---

## 面試說法

```txt
SecureCart 是我做的一個 SaaS 訂閱結帳 side project。

我沒有把它做成一般商品商城，而是聚焦在更接近真實 B2B / SaaS 產品會遇到的流程，
例如訂閱方案、結帳、TapPay hosted fields / prime、訂閱管理、帳單紀錄、
受保護路由、安全回調 URL、CSP、表單驗證與 CI 品質把關。

這個專案的目的不是展示單純切版，
而是展示我如何設計一個可維護、有資安意識、接近實務情境的 Next.js App Router 前端架構。
```

---

## 開發優先順序

### 第一階段：專案基礎

- [x] 建立 Next.js App Router 專案
- [x] 設定 pnpm
- [x] 建立基本路由
- [x] 建立主題 / 版型
- [x] 建立模擬資料
- [x] 建立共用 Button / Card / Input 元件

### 第二階段：方案頁 + 結帳

- [x] 訂閱方案列表
- [x] 月繳 / 年繳切換
- [x] 結帳步驟
- [x] 帳務資訊表單
- [x] TapPay hosted fields 信用卡驗證
- [x] TapPay prime 取得流程
- [x] 結帳結果頁

### 第三階段：帳務管理

- [x] 帳務總覽
- [x] 目前訂閱狀態
- [x] 付款方式列表 UI
- [ ] 付款方式管理頁接入 TapPay 新增卡
- [x] 帳單紀錄
- [x] 取消訂閱
- [x] 升級 / 降級方案

### 第四階段：資安 + 測試

- [x] 安全回調 URL
- [x] CSP header 模擬
- [x] 受保護路由守衛
- [ ] Supabase Auth Email 登入
- [ ] Supabase Auth 登出
- [ ] Supabase session server-side 讀取
- [ ] 移除 mock login API 依賴
- [x] Vitest 測試基礎
- [ ] 價格計算測試
- [ ] 結帳驗證測試

### 第五階段：完善細節

- [ ] 載入骨架屏
- [x] 錯誤狀態
- [ ] 空狀態
- [ ] Toast / Snackbar 提示
- [x] 響應式版面
- [ ] README
- [ ] Demo 截圖
- [ ] 部署上線

---

## 最終目標

SecureCart 要讓面試官看到：

```txt
我不是只會做畫面，
我能設計接近真實產品的前端架構，
包含登入、付款、訂閱、帳務、資安、狀態管理、測試與維護性。
```
