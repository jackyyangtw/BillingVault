# SecureCart 專案計畫

## 專案定位

**SecureCart** 是一個以 **SaaS 訂閱與信用卡管理流程** 為核心的 Next.js side project。

這不是一般商品商城，而是用來展示：

- 安全的登入驗證流程（Supabase Auth Email 登入）
- Supabase Postgres + Prisma 的 server-only 資料層
- SaaS 訂閱方案
- 方案選擇流程
- 信用卡管理（不接真實金流、不扣款）
- 訂閱管理
- 帳單紀錄
- 表單驗證
- 以資安為核心的前端架構
- 可維護的 Next.js App Router 結構

## 專案一句話描述

```txt
A secure SaaS subscription and card management demo built with Next.js App Router.
```

## GitHub 描述

```txt
A secure SaaS subscription and card management demo built with Next.js App Router, featuring pricing plans, subscription management, card management UI, billing history, form validation, and security-focused frontend architecture.
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

| 狀態 | 優先級 | 功能            | 說明                                                  |
| ---- | ------ | --------------- | ----------------------------------------------------- |
| ✅   | P0     | 訂閱方案頁      | 顯示 Starter / Pro / Business / Enterprise 方案       |
| 🟡   | P0     | 真實 Email 登入 | 使用 Supabase Auth Email/Password；僅保留一組測試帳號 |
| ✅   | P0     | 方案選擇流程    | 選方案、填寫帳務資料、建立 demo 訂閱狀態              |
| ✅   | P0     | 帳務頁面        | 顯示目前方案、付款方式與帳務資訊                      |
| ✅   | P0     | 訂閱狀態        | active / trialing / past_due / canceled               |
| ✅   | P1     | 升級 / 降級     | 方案升級與降級流程 UI                                 |
| ✅   | P1     | 取消訂閱        | 取消訂閱流程與確認彈窗                                |
| 🟡   | P1     | 信用卡管理      | 顯示 / 新增 / 移除付款方式；不送真實金流、不扣款      |
| ✅   | P1     | 帳單紀錄        | 帳單紀錄與 demo 狀態                                  |
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
| ✅   | `/checkout`             | 方案確認頁 | 選方案、帳務資料、確認 demo 訂閱  |
| ✅   | `/checkout/success`     | 成功頁     | demo 訂閱建立結果                 |
| ✅   | `/checkout/failure`     | 失敗頁     | demo 流程失敗結果                 |
| ✅   | `/account/billing`      | 帳務頁     | 目前方案、付款方式、帳單摘要      |
| ✅   | `/account/subscription` | 訂閱管理頁 | 升級、降級、取消訂閱              |
| 🟡   | `/account/payment`      | 付款方式頁 | 信用卡列表與管理；不進行扣款      |
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
| 驗證服務     | Supabase Auth（Email/Password only，只負責登入）      |
| 資料庫       | Supabase Postgres                                     |
| ORM / 資料層 | Prisma（唯一資料查詢入口）                            |
| 伺服器狀態   | TanStack Query（僅用於非敏感 client-side UI flow）    |
| 客戶端狀態   | Zustand                                               |
| 信用卡 UI    | 信用卡表單 / 付款方式管理；不串真實金流               |
| 外部狀態訂閱 | `useSyncExternalStore` 管理信用卡欄位狀態             |
| 測試         | Vitest                                                |
| 資安         | CSP nonce、safe callback URL、server-only data access |
| CI           | 尚待規劃                                              |

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
            CardFields.tsx

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
    card/
      index.tsx
      cardStatusStore.ts

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
- Protected route group 透過 `src/app/(protected)/layout.tsx` 掛上信用卡欄位狀態 provider。
- 信用卡欄位狀態與付款方式管理 UI 集中在 provider / feature component，不放在 `app/` 內。
- Checkout 的付款卡元件已依 200 行規則拆為 `PaymentMethodCard/index.tsx` 與卡片欄位元件。
- 跨多層目錄的 import 使用 `@/` alias；相對路徑最多保留到 `../../`。
- 登入流程下一步改為 Supabase Auth Email/Password；先不做 OAuth、不開放註冊，只使用一組測試帳號完成真實 session flow。
- 業務資料下一步改為 Prisma-only data access；Client 不直接查詢 Supabase Postgres 或敏感資料。

---

## Supabase Auth 登入規劃

### MVP 範圍

| 狀態 | 項目         | 說明                                                                  |
| ---- | ------------ | --------------------------------------------------------------------- |
| 🟡   | Email 登入   | `/login` 使用 Supabase Auth `signInWithPassword`                      |
| 🟡   | Session 管理 | 使用 Supabase SSR cookie flow，server-side 讀取目前使用者             |
| 🟡   | 登出         | 呼叫 Supabase Auth `signOut` 後導回首頁或登入頁                       |
| 🟡   | 測試帳號     | 僅建立一組測試帳號，供 demo / 面試展示使用                            |
| ⬜   | 註冊         | MVP 不開放註冊，避免 demo 使用者自行建立帳號                          |
| ⬜   | OAuth        | MVP 不接 Google / Facebook / LINE，保留為後續擴充                     |
| ⬜   | 資料查詢     | Supabase Auth 不查業務資料；訂閱、帳單、付款方式等資料一律透過 Prisma |

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
| `src/actions/logout.ts`             | 改用 Supabase Auth signOut                                          |
| `src/lib/auth/dal.ts`               | 由 Supabase session 取得目前使用者，回傳最小 UserProfile DTO        |
| `src/lib/prisma/`                   | Prisma client 與 server-only 業務資料查詢入口                       |
| `src/proxy.ts`                      | 維持快速樂觀檢查與 safe callback URL，不做完整資料授權              |

---

## 資料操作規劃

> 登入交給 Supabase Auth；業務資料交給 Supabase Postgres + Prisma。Route Handler / Server Action 是唯一對外資料操作入口，Client 不直接查詢敏感資料。

| 狀態 | 入口                            | 方法 | 資料入口 | 說明                                   |
| ---- | ------------------------------- | ---- | -------- | -------------------------------------- |
| ❌   | `/api/auth/login`               | POST | Supabase | 不再規劃；改用 Supabase Auth action    |
| ❌   | `/api/auth/logout`              | POST | Supabase | 不再規劃；改用 Supabase Auth action    |
| ⬜   | `/api/pricing/plans`            | GET  | Prisma   | 取得公開方案列表                       |
| ⬜   | `/api/checkout`                 | POST | Prisma   | 驗證 session、建立 demo 訂閱狀態       |
| ⬜   | `/api/subscription/current`     | GET  | Prisma   | 驗證 session 後取得目前訂閱狀態        |
| ⬜   | `/api/subscription/change-plan` | POST | Prisma   | 驗證 session 與訂閱所有權後升級 / 降級 |
| ⬜   | `/api/subscription/cancel`      | POST | Prisma   | 驗證 session 與訂閱所有權後取消訂閱    |
| ⬜   | `/api/payment-methods`          | GET  | Prisma   | 驗證 session 後取得付款方式            |
| ⬜   | `/api/payment-methods`          | POST | Prisma   | 驗證 session 後新增信用卡管理資料      |
| ⬜   | `/api/invoices`                 | GET  | Prisma   | 驗證 session 後取得帳單紀錄            |
| ⬜   | `/api/team/members`             | GET  | Prisma   | 驗證 session 與團隊權限後取得成員      |

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
| `active`     | 訂閱正常             |
| `past_due`   | 付款方式需更新       |
| `canceled`   | 已取消訂閱           |
| `incomplete` | 訂閱尚未完成         |

---

## 信用卡管理流程設計

```txt
選擇方案
  ↓
建立 demo 訂閱狀態
  ↓
填寫帳務資訊
  ↓
填寫信用卡管理表單
  ↓
儲存卡片品牌、末四碼與到期月份等展示資料
  ↓
確認 demo 訂閱
  ↓
顯示結果
```

## 方案確認頁面步驟

| 步驟        | 說明                          |
| ----------- | ----------------------------- |
| 1. 選擇方案 | 選擇 Starter / Pro / Business |
| 2. 帳務資訊 | 填寫帳務資訊                  |
| 3. 付款方式 | 信用卡管理表單                |
| 4. 確認訂單 | 確認方案、價格、付款方式      |
| 5. 結果     | 成功 / 失敗 / 處理中          |

> 本專案不串接真實金流、不送出扣款、不建立真實付款交易。信用卡資料僅用於管理 UI 與資料流程展示；資料庫只保存展示需要的非敏感欄位，例如卡片品牌、末四碼、到期月份與預設卡狀態。

---

## 資安展示點

| 功能             | 展示內容                                |
| ---------------- | --------------------------------------- |
| 安全回調 URL     | 防止外站 redirect                       |
| CSP nonce        | 展示基本 CSP header 設計                |
| Server-side Auth | Supabase Auth 只負責登入與 session 驗證 |
| Server-only DAL  | Prisma 作為唯一資料查詢入口             |
| 表單驗證         | 所有表單使用 Zod schema                 |
| 錯誤碼對應       | 後端 error code 對應 i18n 訊息          |
| 送出鎖定         | 避免重複送出表單                        |
| 冪等鍵概念       | 避免重複建立 demo 訂閱或付款方式資料    |
| 受保護路由       | account / checkout / dashboard 需要登入 |
| Session 過期處理 | Session 過期時自動導回登入頁            |

---

## 測試項目

| 狀態 | 測試目標      | 範例                                                   |
| ---- | ------------- | ------------------------------------------------------ |
| ✅   | 安全回調 URL  | 擋掉 `https://evil.com`、`javascript:`、`//evil.com`   |
| ✅   | CSP header    | nonce 與第三方 script/frame 白名單                     |
| ⬜   | Supabase Auth | email/password 登入、登出、session 過期                |
| ⬜   | Prisma DAL    | Server-only 查詢、DTO 回傳、禁止 Client 直接查敏感資料 |
| ⬜   | 價格計算      | 月繳 / 年繳折扣計算                                    |
| ⬜   | 方案比較      | 不同方案功能顯示                                       |
| ⬜   | 訂閱狀態      | 不同狀態顯示正確 UI                                    |
| ⬜   | 方案確認驗證  | 必填欄位、格式錯誤                                     |
| 🟡   | 信用卡管理    | 新增、移除、設為預設、成功 / 失敗流程                  |
| ⬜   | 帳單格式化    | 金額、日期、狀態格式化                                 |

---

## README 可以強調的技術決策

| 主題                                 | 說明                                                  |
| ------------------------------------ | ----------------------------------------------------- |
| 為何選 SaaS 訂閱                     | 比一般商城更適合展示帳務、訂閱、信用卡管理與權限流程  |
| 為何用 Supabase Auth                 | 只處理 Email 登入與 session 驗證，降低自建 auth 成本  |
| 為何用 Supabase Postgres             | 使用託管 PostgreSQL 作為真實資料庫                    |
| 為何用 Prisma                        | 作為唯一資料查詢入口，集中 schema、關聯與型別         |
| 為何用 Server Action / Route Handler | 作為唯一資料操作入口，集中驗證 session、輸入與授權    |
| 為何用 Zod + React Hook Form         | 集中管理表單驗證與型別                                |
| 為何用 TanStack Query                | 管理 server state、loading、error、retry              |
| 為何用 Zustand                       | 管理少量 client-side 方案確認 / UI 狀態               |
| 為何做安全回調 URL                   | 避免 open redirect                                    |
| 為何實作 CSP                         | 展示基本資安 header 意識                              |
| 為何不串真實金流                     | 聚焦前端架構、server-only data access 與信用卡管理 UI |
| 為何集中卡片狀態 Provider            | card status store 不混入 app route                    |
| 為何要寫測試                         | 驗證信用卡管理、callback、價格、訂閱狀態等核心邏輯    |

---

## 面試說法

```txt
SecureCart 是我做的一個 SaaS 訂閱與信用卡管理 side project。

我沒有把它做成一般商品商城，而是聚焦在更接近真實 B2B / SaaS 產品會遇到的流程，
例如訂閱方案、方案確認、信用卡管理、訂閱管理、帳單紀錄、
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
- [x] 信用卡欄位驗證
- [ ] 信用卡管理資料寫入 Supabase Postgres
- [x] demo 流程結果頁

### 第三階段：帳務管理

- [x] 帳務總覽
- [x] 目前訂閱狀態
- [x] 付款方式列表 UI
- [ ] 付款方式管理頁接入 Prisma 寫入 / 移除 / 設為預設
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
- [ ] 建立 Prisma server-only data access layer
- [ ] 將訂閱 / 帳單 / 付款方式資料改由 Prisma 讀寫
- [ ] 確保 Client Component 不直接查詢敏感資料
- [x] Vitest 測試基礎
- [ ] 價格計算測試
- [ ] 信用卡管理驗證測試

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
包含登入、信用卡管理、訂閱、帳務、資安、狀態管理、測試與維護性。
```
