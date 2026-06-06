# SecureCart 專案計畫

## 專案定位

**SecureCart** 是一個以 **SaaS 訂閱與信用卡管理流程** 為核心的 Next.js side project。

這不是一般商品商城，而是用來展示：

- 安全的登入驗證流程（Supabase Auth Email 登入）
- Supabase Postgres + Prisma 的 server-only 資料層
- SaaS 訂閱方案
- 方案選擇流程
- TapPay sandbox 模擬付款流程（不接 production、不真實扣款）
- 本地訂單與付款交易紀錄
- 信用卡管理
- 訂閱管理
- 帳單紀錄
- 表單驗證
- 以資安為核心的前端架構
- 可維護的 Next.js App Router 結構

## 專案一句話描述

```txt
A secure SaaS subscription and sandbox payment flow demo built with Next.js App Router.
```

## GitHub 描述

```txt
A secure SaaS subscription and sandbox payment flow demo built with Next.js App Router, featuring pricing plans, TapPay sandbox checkout, local order/payment records, subscription management, card management UI, billing history, form validation, and security-focused frontend architecture.
```

---

## 為什麼選 SaaS 訂閱，而不是一般商城？

| 項目            | 一般實體商城 | SaaS 訂閱服務 |
| --------------- | ------------ | ------------- |
| 商品列表        | 重要         | 次要          |
| 物流 / 庫存     | 重要         | 不需要        |
| 方案選擇流程    | 重要         | 非常重要      |
| 綁卡 / 付款方式 | 重要         | 很適合展示    |
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

SecureCart 可以想像成一個「安全 SaaS 訂閱與信用卡管理平台」，販售開發者工具或團隊軟體服務。

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

| 狀態 | 優先級 | 功能                | 說明                                                         |
| ---- | ------ | ------------------- | ------------------------------------------------------------ |
| ✅   | P0     | 訂閱方案頁          | 顯示 Starter / Pro / Business / Enterprise 方案              |
| ✅   | P0     | 真實 Email 登入     | 使用 Supabase Auth Email/Password；僅保留一組測試帳號        |
| ✅   | P0     | 方案選擇流程        | 選方案、填寫帳務資料、建立 sandbox 訂單與訂閱狀態            |
| ✅   | P0     | TapPay sandbox 付款 | hosted fields 取 prime，後端呼叫 TapPay sandbox Pay by Prime |
| ✅   | P0     | 訂單 / 付款紀錄     | 建立本地訂單、付款交易紀錄與 sandbox trade id 關聯           |
| ✅   | P0     | 帳務頁面            | 顯示目前方案、付款方式與帳務資訊                             |
| ✅   | P0     | 訂閱狀態            | active / trialing / past_due / canceled                      |
| ✅   | P1     | 升級 / 降級         | 方案升級與降級流程 UI                                        |
| ✅   | P1     | 取消訂閱            | 取消訂閱流程與確認彈窗                                       |
| ✅   | P1     | 信用卡管理          | 顯示 / TapPay hosted fields 新增付款方式；sandbox only       |
| ✅   | P1     | 帳單紀錄            | 帳單紀錄與 sandbox 付款狀態                                  |
| ⬜   | P2     | 團隊席位            | 團隊成員與席位計費                                           |
| ⬜   | P2     | 稽核紀錄            | 帳務與安全操作紀錄                                           |

---

## 頁面規劃

| 狀態 | Route                   | 頁面       | 功能                                       |
| ---- | ----------------------- | ---------- | ------------------------------------------ |
| ✅   | `/`                     | 首頁       | 產品介紹與 CTA                             |
| ✅   | `/pricing`              | 方案頁     | 方案比較、月繳 / 年繳切換                  |
| ✅   | `/product/[id]`         | 產品詳情頁 | SaaS 產品介紹與方案導流                    |
| ✅   | `/login`                | 登入頁     | Supabase Auth Email/Password 登入          |
| ✅   | `/checkout`             | 方案確認頁 | 選方案、帳務資料、TapPay sandbox 模擬付款  |
| ✅   | `/checkout/success`     | 成功頁     | sandbox 訂單與付款成功結果                 |
| ✅   | `/checkout/failure`     | 失敗頁     | sandbox 付款失敗結果                       |
| ✅   | `/account/billing`      | 帳務頁     | 目前方案、付款方式、帳單摘要               |
| ✅   | `/account/subscription` | 訂閱管理頁 | 升級、降級、取消訂閱                       |
| ✅   | `/account/payment`      | 付款方式頁 | 信用卡列表、新增、移除與預設卡；不真實扣款 |
| ⬜   | `/account/team`         | 團隊管理頁 | 席位、成員、角色權限                       |
| ⬜   | `/account/security`     | 安全設定頁 | 登入紀錄、安全設定                         |
| ⬜   | `/dashboard`            | 儀表板     | 訂閱後的產品使用狀態                       |

---

## 技術棧

| 類型         | 技術 / 現況                                                         |
| ------------ | ------------------------------------------------------------------- |
| 框架         | Next.js 16 App Router                                               |
| React        | React 19 + React Compiler                                           |
| 程式語言     | TypeScript                                                          |
| 套件管理工具 | pnpm                                                                |
| 樣式         | Tailwind CSS v4 + shadcn/ui                                         |
| 表單         | React Hook Form                                                     |
| 驗證         | Zod                                                                 |
| 驗證服務     | Supabase Auth（Email/Password only，只負責登入）                    |
| 資料庫       | Supabase Postgres                                                   |
| ORM / 資料層 | Prisma（唯一資料查詢入口）                                          |
| 伺服器狀態   | TanStack Query（僅用於非敏感 client-side UI flow）                  |
| 客戶端狀態   | Zustand                                                             |
| 信用卡 UI    | TapPay hosted fields / sandbox prime / 付款方式管理                 |
| 金流模擬     | TapPay hosted fields + TapPay sandbox Pay by Prime；不接 production |
| 外部狀態訂閱 | `useSyncExternalStore` 管理 TapPay 欄位狀態                         |
| 測試         | Vitest                                                              |
| 資安         | CSP nonce、safe callback URL、server-only data access               |
| CI           | 尚待規劃                                                            |

---

## 核心架構邊界

SecureCart 的後端與資料存取採用保守分層，避免 Client Component 直接碰敏感資料或資料庫查詢。

| 層級                          | 職責                                                          | 不做什麼                                      |
| ----------------------------- | ------------------------------------------------------------- | --------------------------------------------- |
| Supabase Auth                 | 只負責 Email/Password 登入、登出與 session 驗證               | 不作為業務資料查詢入口                        |
| Supabase Postgres             | 只作為 PostgreSQL 資料庫                                      | 不讓 Client 直接查敏感資料                    |
| Prisma                        | 唯一資料查詢入口，集中 schema、關聯查詢與資料模型             | 不在 Client Component 中使用                  |
| Server Action / Route Handler | 唯一資料操作入口，負責驗證使用者、驗證輸入、執行 mutation/API | 不信任 client 傳來的 userId、價格或權限狀態   |
| Client Component              | 只負責 UI、表單互動、狀態顯示與送出 action                    | 不直接查詢敏感資料、不直接呼叫 Supabase table |

### 資料流原則

```txt
Client UI
  ↓ submit / request
Server Action or Route Handler
  ↓ verify Supabase session
Prisma
  ↓ query / mutation
Supabase Postgres
```

- 登入狀態由 Supabase Auth 驗證。
- 業務資料一律透過 Prisma 讀寫 Supabase Postgres。
- Server Action / Route Handler 必須重新驗證 session 與授權，不依賴頁面層 UI 判斷。
- 回傳給 Client 的資料必須是 DTO，只包含畫面需要的非敏感欄位。
- Supabase browser client 不作為敏感資料查詢入口；若保留，只限登入狀態或非敏感 auth UI 輔助。

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

      account/
        layout.tsx
        billing/page.tsx
        subscription/page.tsx
        payment/page.tsx
          _components/AddPaymentMethodCard/

    api/
      payment-methods/route.ts

    _components/layout/
      Navbar/
      Footer.tsx

  components/
    shared/
      TapPayHostedField.tsx
    ui/

  providers/
    AuthProvider.tsx
    QueryProvider.tsx
    ThemeProvider.tsx
    tappay/
      index.tsx
      cardSetup.ts
      cardStatusStore.ts
      tappay.ts
      useTapPayCardFields.ts

  lib/
    auth/
      dal.ts
      types.ts
    prisma/
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
- Protected route group 透過 `src/app/(protected)/layout.tsx` 掛上 `TapPayProvider`，集中載入 TapPay SDK 與 CSP nonce。
- TapPay hosted fields 生命週期集中在 `src/providers/tappay/useTapPayCardFields.ts`，包含 `card.setup`、`onUpdate`、狀態同步、cleanup 與 dark mode iframe reveal。
- TapPay 欄位 UI 提升為 `src/components/shared/TapPayHostedField.tsx`，由 checkout 與 account payment 共同使用。
- `/account/payment` 的新增卡片元件已依 200 行規則拆為 `AddPaymentMethodCard/` 資料夾。
- 付款方式管理已改由 Server Action + Prisma DAL 寫入、移除、設為預設與查詢，Client 只接收非敏感卡片摘要。
- 跨多層目錄的 import 使用 `@/` alias；相對路徑最多保留到 `../../`。
- 登入流程下一步改為 Supabase Auth Email/Password；先不做 OAuth、不開放註冊，只使用一組測試帳號完成真實 session flow。
- 業務資料下一步改為 Prisma-only data access；Client 不直接查詢 Supabase Postgres 或敏感資料。

---

## Supabase Auth 登入規劃

### MVP 範圍

| 狀態 | 項目         | 說明                                                                  |
| ---- | ------------ | --------------------------------------------------------------------- |
| ✅   | Email 登入   | `/login` 使用 Supabase Auth `signInWithPassword`                      |
| ✅   | Session 管理 | 使用 Supabase SSR cookie flow，server-side 讀取目前使用者             |
| ✅   | 登出         | 呼叫 Supabase Auth `signOut` 後導回首頁或登入頁                       |
| ✅   | 測試帳號     | 僅建立一組測試帳號，供 demo / 面試展示使用                            |
| ✅   | 資料查詢     | Supabase Auth 不查業務資料；訂閱、帳單、付款方式等資料一律透過 Prisma |

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

| 模組                                | 說明                                                                |
| ----------------------------------- | ------------------------------------------------------------------- |
| `src/lib/supabase/client.ts`        | Client auth 輔助；不得用於敏感資料查詢                              |
| `src/lib/supabase/server.ts`        | Server Action / Server Component 使用的 Supabase Auth server client |
| `src/app/(public)/login/actions.ts` | 改用 Supabase Auth email/password 登入                              |
| `src/lib/auth/logout.ts`            | 改用 Supabase Auth signOut                                          |
| `src/lib/auth/dal.ts`               | 由 Supabase session 取得目前使用者，回傳最小 UserProfile DTO        |
| `src/lib/prisma.ts`                 | Prisma client 與 server-only 業務資料查詢入口                       |
| `src/proxy.ts`                      | 維持快速樂觀檢查與 safe callback URL，不做完整資料授權              |

---

## 資料操作規劃

> 登入交給 Supabase Auth；業務資料交給 Supabase Postgres + Prisma。Route Handler / Server Action 是唯一對外資料操作入口，Client 不直接查詢敏感資料。

| 狀態 | 入口                            | 方法          | 資料入口                | 說明                                                                      |
| ---- | ------------------------------- | ------------- | ----------------------- | ------------------------------------------------------------------------- |
| ❌   | `/api/auth/login`               | POST          | Supabase                | 不再規劃；已改用 Supabase Auth action                                     |
| ❌   | `/api/auth/logout`              | POST          | Supabase                | 不再規劃；已改用 Supabase Auth action                                     |
| ⬜   | `/api/pricing/plans`            | GET           | Prisma                  | 取得公開方案列表；目前仍使用 fixture                                      |
| ✅   | `submitCheckoutAction`          | Server Action | Prisma + TapPay sandbox | 驗證 session、建立本地訂單、TapPay sandbox 授權、寫入付款紀錄             |
| ✅   | `listSubscriptionOverview`      | DAL           | Prisma                  | 驗證 session 後取得目前訂閱狀態                                           |
| ✅   | `changeSubscriptionPlanAction`  | Server Action | Prisma                  | 驗證 session 與訂閱所有權後升級 / 降級                                    |
| ✅   | `cancelSubscriptionAction`      | Server Action | Prisma                  | 驗證 session 與訂閱所有權後取消訂閱                                       |
| ✅   | `listPaymentMethodsAction`      | Server Action | Prisma                  | 驗證 session 後取得付款方式                                               |
| ✅   | `createPaymentMethodAction`     | Server Action | Prisma + TapPay sandbox | 驗證 session 與 TapPay prime payload，Bind Card 後儲存 tokenized 卡片摘要 |
| ✅   | `deletePaymentMethodAction`     | Server Action | Prisma                  | 驗證 session 與付款方式所有權後移除卡片                                   |
| ✅   | `setDefaultPaymentMethodAction` | Server Action | Prisma                  | 驗證 session 與付款方式所有權後設定預設卡                                 |
| ✅   | `listBillingOverview`           | DAL           | Prisma                  | 驗證 session 後取得帳單 / 付款紀錄                                        |
| ⬜   | `/api/team/members`             | GET           | Prisma                  | 驗證 session 與團隊權限後取得成員                                         |

---

## 訂單與付款紀錄規劃

TapPay sandbox 只負責模擬授權與交易回傳，不負責建立 SecureCart 的訂單資料。SecureCart 需要在自己的資料庫建立訂單、付款紀錄與訂閱狀態，並用本地 `orderNumber` 對應 TapPay 的 `order_number`。

```txt
Checkout request
  ↓
建立本地 Order（pending）
  ↓
建立 PaymentRecord（pending，含 idempotency key）
  ↓
呼叫 TapPay sandbox Pay by Prime
  ↓
依 TapPay response 更新 PaymentRecord
  ↓
成功：Order → paid，Subscription → active / trialing
失敗：Order → failed，PaymentRecord → failed
```

### 建議資料模型

| Model           | 用途                         | 重要欄位                                                                                                           |
| --------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Order`         | 保存本地訂單與 checkout 結果 | `id`、`userId`、`orderNumber`、`planId`、`productId`、`cycle`、`amount`、`currency`、`status`                      |
| `PaymentRecord` | 保存每次付款嘗試             | `id`、`orderId`、`provider`、`providerTradeId`、`orderNumber`、`amount`、`status`、`failureCode`、`failureMessage` |
| `Invoice`       | 帳務顯示與歷史紀錄           | `id`、`orderId`、`paymentRecordId`、`invoiceNumber`、`amount`、`status`、`issuedAt`                                |
| `Subscription`  | 保存目前訂閱狀態             | `id`、`userId`、`planId`、`status`、`currentPeriodStart`、`currentPeriodEnd`                                       |

### TapPay sandbox 邊界

| 項目     | 規劃                                                                 |
| -------- | -------------------------------------------------------------------- |
| 前端 SDK | `NEXT_PUBLIC_TAPPAY_SERVER_TYPE=sandbox`                             |
| 後端 API | 只允許呼叫 `https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime`  |
| 扣款狀態 | sandbox 只模擬授權，不真實扣款                                       |
| 訂單編號 | 由 SecureCart 產生並傳入 TapPay `order_number`                       |
| 交易 ID  | 保存 TapPay 回傳的 `rec_trade_id` 到 `PaymentRecord.providerTradeId` |
| 金流密鑰 | `partner_key` 只存在 server-only env，不暴露到 Client Component      |
| 防呆     | 非 production demo 預設拒絕 TapPay production endpoint               |

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

| 狀態         | UI 顯示              |
| ------------ | -------------------- |
| `trialing`   | 試用中，顯示剩餘天數 |
| `active`     | 訂閱中               |
| `past_due`   | 付款方式需更新       |
| `canceled`   | 已取消訂閱           |
| `incomplete` | 訂閱尚未完成         |

---

## Checkout 付款流程設計

```txt
選擇方案
  ↓
填寫帳務資訊
  ↓
使用 TapPay hosted fields 填寫信用卡資料
  ↓
前端呼叫 TapPay `getPrime()` 取得一次性 prime
  ↓
送出 `submitCheckoutAction`
  ↓
後端驗證 session、方案、金額與 prime payload
  ↓
建立本地 pending order 與 pending payment record
  ↓
後端呼叫 TapPay sandbox Pay by Prime
  ↓
依 TapPay response 更新付款紀錄與訂單狀態
  ↓
付款成功後建立 / 更新訂閱與 invoice
  ↓
顯示成功或失敗結果
```

## 信用卡管理流程設計

```txt
開啟付款方式頁
  ↓
使用 TapPay hosted fields 填寫信用卡資料
  ↓
前端呼叫 TapPay `getPrime()` 取得一次性 prime
  ↓
送出 `createPaymentMethodAction`
  ↓
後端驗證 TapPay hosted fields 回傳的非敏感卡片摘要並寫入 Prisma
  ↓
後端呼叫 TapPay sandbox Bind Card 取得 `card_key` / `card_token`
  ↓
只保存卡片品牌、末四碼、到期日、card identifier 等非敏感資料
  ↓
付款方式列表顯示可用 / 過期 / 需更新狀態
```

## 方案確認頁面步驟

| 步驟        | 說明                          |
| ----------- | ----------------------------- |
| 1. 選擇方案 | 選擇 Starter / Pro / Business |
| 2. 帳務資訊 | 填寫帳務資訊                  |
| 3. 付款方式 | 信用卡管理表單                |
| 4. 確認訂單 | 確認方案、價格、付款方式      |
| 5. 結果     | 成功 / 失敗 / 處理中          |

> 現況：本專案目前已串接 TapPay hosted fields 進行前端 tokenization，checkout 先取得一次性 prime，付款方式頁會以 TapPay sandbox Bind Card 取得 `card_key` / `card_token`，並保存展示需要的非敏感欄位，例如卡片品牌、末四碼、持卡人、帳務 Email 與 TapPay card identifier。

> 目標：checkout 新卡流程已改為 TapPay sandbox Pay by Prime，並以 `remember: true` 保存 TapPay 回傳的 `card_key` / `card_token`；已儲存卡片扣款改用 Pay by Card Token。SecureCart 需自己建立訂單、付款紀錄與訂閱資料；TapPay 回傳的 `rec_trade_id` 只作為 sandbox 交易對帳與查詢依據。既有缺少 token 的舊卡需要重新綁定後才能扣款。

---

## 資安展示點

| 功能             | 展示內容                                                         |
| ---------------- | ---------------------------------------------------------------- |
| 安全回調 URL     | 防止外站 redirect                                                |
| CSP nonce        | 展示基本 CSP header 設計                                         |
| Server-side Auth | Supabase Auth 只負責登入與 session 驗證                          |
| Server-only DAL  | Prisma 作為唯一資料查詢入口                                      |
| 表單驗證         | 所有表單使用 Zod schema                                          |
| 金流欄位隔離     | TapPay hosted fields 接管卡號 / 到期日 / CVC，前端不保存原始卡號 |
| 錯誤碼對應       | 後端 error code 對應 i18n 訊息                                   |
| 送出鎖定         | 避免重複送出表單                                                 |
| 冪等鍵保護       | Checkout 使用 idempotency key 與資料庫唯一約束避免重複訂單       |
| sandbox 金流隔離 | TapPay sandbox endpoint 與 production endpoint 明確分離          |
| 受保護路由       | account / checkout / dashboard 需要登入                          |
| Session 過期處理 | Session 過期時自動導回登入頁                                     |

---

## 測試項目

| 狀態 | 測試目標      | 範例                                                           |
| ---- | ------------- | -------------------------------------------------------------- |
| ✅   | 安全回調 URL  | 擋掉 `https://evil.com`、`javascript:`、`//evil.com`           |
| ✅   | CSP header    | nonce 與第三方 script/frame 白名單                             |
| ✅   | Supabase Auth | email/password 登入、登出、callbackUrl 與 session 失效導回登入 |
| ✅   | Prisma DAL    | 已測 server-only Prisma 查詢、DTO 回傳、ownership 與交易流程   |
| ✅   | 價格計算      | 月繳 / 年繳折扣計算                                            |
| ⬜   | 方案比較      | 不同方案功能顯示                                               |
| ✅   | 訂閱狀態      | 已測目前訂閱選取、即將到期、mapper 與 UI 狀態顯示              |
| ⬜   | 方案確認驗證  | 必填欄位、格式錯誤                                             |
| ✅   | sandbox 付款  | TapPay sandbox 成功 / 失敗、response mapping、endpoint 防呆    |
| ✅   | 訂單紀錄      | 已測建立成功、冪等鍵防重、pending / paid / failed 結果查詢     |
| ✅   | 付款紀錄      | 已測成功更新、TapPay 失敗 mapping 與失敗頁錯誤 DTO             |
| ✅   | 信用卡管理    | 已測 Prisma DAL、TapPay 綁卡、hosted fields UI 與卡片狀態顯示  |
| ✅   | 帳單格式化    | 已測繁中日期時間、訂單 / 付款 / 發票 / 訂閱狀態 label          |

---

## README 可以強調的技術決策

| 主題                                 | 說明                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| 為何選 SaaS 訂閱                     | 比一般商城更適合展示帳務、訂閱、信用卡管理與權限流程                            |
| 為何用 Supabase Auth                 | 只處理 Email 登入與 session 驗證，降低自建 auth 成本                            |
| 為何用 Supabase Postgres             | 使用託管 PostgreSQL 作為真實資料庫                                              |
| 為何用 Prisma                        | 作為唯一資料查詢入口，集中 schema、關聯與型別                                   |
| 為何用 Server Action / Route Handler | 作為唯一資料操作入口，集中驗證 session、輸入與授權                              |
| 為何用 Zod + React Hook Form         | 集中管理表單驗證與型別                                                          |
| 為何用 TanStack Query                | 管理 server state、loading、error、retry                                        |
| 為何用 Zustand                       | 管理少量 client-side 方案確認 / UI 狀態                                         |
| 為何做安全回調 URL                   | 避免 open redirect                                                              |
| 為何實作 CSP                         | 展示基本資安 header 意識                                                        |
| 為何用 TapPay sandbox 模擬完整金流   | 展示 hosted fields、server-only 金流邊界、訂單 / 交易紀錄與錯誤處理，不真實扣款 |
| 為何集中 TapPay 狀態 Provider / hook | SDK 載入、hosted fields lifecycle 與 card status store 不混入 route component   |
| 為何要寫測試                         | 驗證信用卡管理、sandbox 付款、callback、價格、訂閱狀態等核心邏輯                |

---

## 面試說法

```txt
SecureCart 是我做的一個 SaaS 訂閱與信用卡管理 side project。

我沒有把它做成一般商品商城，而是聚焦在更接近真實 B2B / SaaS 產品會遇到的流程，
例如訂閱方案、方案確認、信用卡管理、訂閱管理、帳單紀錄、
TapPay sandbox 模擬付款、訂單與交易紀錄、
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

### 第二階段：方案頁 + 方案確認

- [x] 訂閱方案列表
- [x] 月繳 / 年繳切換
- [x] 方案確認步驟
- [x] 帳務資訊表單
- [x] TapPay hosted fields 信用卡欄位驗證
- [x] Checkout 使用 shared `TapPayHostedField` 與 `useTapPayCardFields`
- [x] Checkout 接入 TapPay sandbox Pay by Prime
- [x] 建立本地訂單與付款紀錄資料模型
- [x] sandbox 付款成功後建立 / 更新訂閱與 invoice
- [x] sandbox 付款失敗後保存錯誤碼與失敗紀錄
- [x] Checkout idempotency key 與資料庫唯一約束防重複訂單
- [x] 信用卡管理資料寫入 Supabase Postgres
- [x] 已儲存卡片扣款接入 TapPay Pay by Card Token API
- [x] demo 流程結果頁

### 第三階段：帳務管理

- [x] 帳務總覽
- [x] 目前訂閱狀態
- [x] 付款方式列表 UI
- [x] 付款方式管理頁新增 TapPay hosted fields dialog
- [x] 付款方式管理頁接入 Prisma 寫入 / 移除 / 設為預設
- [x] 帳單紀錄
- [x] 帳單紀錄接入本地 invoice / payment record
- [x] 取消訂閱
- [x] 升級 / 降級方案

### 第四階段：資安 + 測試

- [x] 安全回調 URL
- [x] CSP header 模擬
- [x] 受保護路由守衛
- [x] Supabase Auth Email 登入
- [x] Supabase Auth 登出
- [x] Supabase session server-side 讀取
- [x] 移除 mock login API 依賴
- [x] 建立 Prisma server-only data access layer
- [x] 將訂閱 / 帳單 / 付款方式資料改由 Prisma 讀寫
- [x] 確保 Client Component 不直接查詢敏感資料
- [x] Vitest 測試基礎
- [x] 價格計算測試
- [x] 信用卡管理 Prisma DAL 驗證測試
- [x] TapPay sandbox response mapping 測試
- [x] 訂單 / 付款紀錄 DAL 測試

### 第五階段：完善細節

- [ ] 載入骨架屏
- [x] 錯誤狀態
- [x] 空狀態
- [x] Toast / Snackbar 提示
- [x] 響應式版面
- [ ] README
- [ ] Demo 截圖
- [ ] 部署上線
