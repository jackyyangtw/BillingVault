# SecureCart 專案計畫

## 專案定位

**SecureCart** 是一個以 **SaaS 訂閱結帳流程** 為核心的 Next.js side project。

這不是一般商品商城，而是用來展示：

- 安全的登入驗證流程
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
| --------------- | -----------: | ------------: |
| 商品列表        |         重要 |          次要 |
| 物流 / 庫存     |         重要 |        不需要 |
| 結帳流程        |         重要 |      非常重要 |
| 綁卡 / 付款方式 |         重要 |      非常重要 |
| 訂閱升降級      |         少見 |      核心功能 |
| 取消訂閱        |         少見 |      核心功能 |
| 帳單紀錄        |         普通 |      核心功能 |
| 權限控管        |         普通 |    很適合展示 |
| 試用 / 方案切換 |         少見 |    很適合展示 |
| 資安流程        |         可做 |        更合理 |

**結論：**  
SaaS 訂閱商城更能展示真實商業產品中的前端架構能力，而不只是購物車 UI。

---

## 產品方向

SecureCart 可以想像成一個「安全 SaaS 訂閱結帳平台」，販售開發者工具或團隊軟體服務。

## 建議販售的 SaaS 產品

| 產品名稱        | 說明                           |   月費 |
| --------------- | ------------------------------ | -----: |
| **CodeGuard**   | 依賴套件安全掃描與 CI 風險警告 | $19/mo |
| **DeployWatch** | 部署監控與版本發布追蹤         | $15/mo |
| **ErrorPulse**  | 前端錯誤追蹤與 Session 診斷    | $29/mo |
| **MetricFlow**  | 產品分析與轉換率儀表板         | $39/mo |
| **TeamVault**   | 安全團隊工作區與存取控制       | $49/mo |

---

## 訂閱方案設計

| 方案           | 適合對象   |     價格 | 功能                             |
| -------------- | ---------- | -------: | -------------------------------- |
| **Starter**    | 個人開發者 |    $9/mo | 1 個專案、基本分析、Email 支援   |
| **Pro**        | 小團隊     |   $29/mo | 5 個專案、進階報表、Webhook 警告 |
| **Business**   | 公司團隊   |   $99/mo | 無限專案、團隊角色、稽核紀錄     |
| **Enterprise** | 大型組織   | 洽詢報價 | SSO、客製 SLA、專屬支援          |

---

## MVP 功能範圍

| 優先級 | 功能         | 說明                                            |
| ------ | ------------ | ----------------------------------------------- |
| P0     | 訂閱方案頁   | 顯示 Starter / Pro / Business / Enterprise 方案 |
| P0     | 模擬登入     | 模擬登入流程與 Session 狀態                     |
| P0     | 結帳流程     | 選方案、填寫付款資料、送出訂閱                  |
| P0     | 帳務頁面     | 顯示目前方案、付款方式與帳務資訊                |
| P0     | 訂閱狀態     | active / trialing / past_due / canceled         |
| P1     | 升級 / 降級  | 方案升級與降級流程                              |
| P1     | 取消訂閱     | 取消訂閱流程與確認彈窗                          |
| P1     | 模擬付款方式 | 模擬信用卡綁定 / 更換付款方式                   |
| P1     | 帳單紀錄     | 帳單紀錄與付款狀態                              |
| P2     | 團隊席位     | 團隊成員與席位計費                              |
| P2     | 稽核紀錄     | 帳務與安全操作紀錄                              |

---

## 頁面規劃

| Route                      | 頁面       | 功能                         |
| -------------------------- | ---------- | ---------------------------- |
| `/`                        | 首頁       | 產品介紹與 CTA               |
| `/pricing`                 | 方案頁     | 方案比較、月繳 / 年繳切換    |
| `/checkout`                | 結帳頁     | 選方案、付款資料、確認訂閱   |
| `/auth/login`              | 登入頁     | 模擬登入                     |
| `/auth/register`           | 註冊頁     | 模擬註冊                     |
| `/auth/callback`           | 驗證回調   | 模擬第三方登入回調           |
| `/account/billing`         | 帳務頁     | 目前方案、付款方式、帳單摘要 |
| `/account/subscription`    | 訂閱管理頁 | 升級、降級、取消訂閱         |
| `/account/payment-methods` | 付款方式頁 | 綁卡 / 更換付款方式          |
| `/account/invoices`        | 帳單紀錄頁 | 帳單紀錄                     |
| `/account/team`            | 團隊管理頁 | 席位、成員、角色權限         |
| `/account/security`        | 安全設定頁 | 登入紀錄、安全設定           |
| `/dashboard`               | 儀表板     | 訂閱後的產品使用狀態         |

---

## 技術棧

| 類型         | 技術                                               |
| ------------ | -------------------------------------------------- |
| 框架         | Next.js App Router                                 |
| 程式語言     | TypeScript                                         |
| 套件管理工具 | pnpm                                               |
| 樣式         | Tailwind CSS / CSS Modules / MUI 擇一              |
| 模擬伺服器   | Next.js Route Handler                              |
| 表單         | React Hook Form                                    |
| 驗證         | Zod                                                |
| 伺服器狀態   | TanStack Query                                     |
| 客戶端狀態   | Zustand                                            |
| URL 狀態     | nuqs                                               |
| 測試         | Vitest                                             |
| 資安         | CSP nonce、safe callback URL、httpOnly Cookie 假設 |
| CI           | GitHub Actions 或 GitLab CI                        |

---

## 建議專案架構

```txt
src/
  app/
    (marketing)/
      page.tsx
      pricing/
        page.tsx

    auth/
      login/
        page.tsx
      register/
        page.tsx
      callback/
        page.tsx

    checkout/
      page.tsx

    account/
      billing/
        page.tsx
      subscription/
        page.tsx
      payment-methods/
        page.tsx
      invoices/
        page.tsx
      team/
        page.tsx
      security/
        page.tsx

    dashboard/
      page.tsx

    api/
      auth/
      checkout/
      subscription/
      billing/
      payment-methods/
      invoices/

  features/
    auth/
    pricing/
    checkout/
    billing/
    subscription/
    payment-methods/
    invoices/
    team/
    security/

  shared/
    components/
    hooks/
    lib/
    utils/
    validations/

  mocks/
    fixtures/
    generators/
```

---

## Mock API 規劃

| API                             | 方法 | 說明             |
| ------------------------------- | ---- | ---------------- |
| `/api/auth/login`               | POST | 模擬登入         |
| `/api/auth/logout`              | POST | 模擬登出         |
| `/api/pricing/plans`            | GET  | 取得方案列表     |
| `/api/checkout`                 | POST | 建立訂閱         |
| `/api/subscription/current`     | GET  | 取得目前訂閱狀態 |
| `/api/subscription/change-plan` | POST | 升級 / 降級方案  |
| `/api/subscription/cancel`      | POST | 取消訂閱         |
| `/api/payment-methods`          | GET  | 取得付款方式     |
| `/api/payment-methods`          | POST | 新增付款方式     |
| `/api/invoices`                 | GET  | 取得帳單紀錄     |
| `/api/team/members`             | GET  | 取得團隊成員     |

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
模擬信用卡 Tokenization
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
| 3. 付款方式 | 模擬綁卡 / Tokenization       |
| 4. 確認訂單 | 確認方案、價格、付款方式      |
| 5. 結果     | 成功 / 失敗 / 處理中          |

---

## 資安展示點

| 功能                 | 展示內容                       |
| -------------------- | ------------------------------ |
| 安全回調 URL         | 防止外站 redirect              |
| CSP nonce            | 展示基本 CSP header 設計       |
| httpOnly Cookie 假設 | Token 不直接暴露給前端         |
| 表單驗證             | 所有表單使用 Zod schema        |
| 錯誤碼對應           | 後端 error code 對應 i18n 訊息 |
| 送出鎖定             | 避免重複送出付款               |
| 冪等鍵概念           | 避免重複建立訂閱               |
| 受保護路由           | account / dashboard 需要登入   |
| Session 過期處理     | Session 過期時自動導回登入頁   |

---

## 測試項目

| 測試目標     | 範例                                                 |
| ------------ | ---------------------------------------------------- |
| 安全回調 URL | 擋掉 `https://evil.com`、`javascript:`、`//evil.com` |
| 價格計算     | 月繳 / 年繳折扣計算                                  |
| 方案比較     | 不同方案功能顯示                                     |
| 訂閱狀態     | 不同狀態顯示正確 UI                                  |
| 結帳驗證     | 必填欄位、格式錯誤                                   |
| 模擬付款     | 成功 / 失敗 / 處理中                                 |
| 帳單格式化   | 金額、日期、狀態格式化                               |

---

## README 可以強調的技術決策

| 主題                         | 說明                                           |
| ---------------------------- | ---------------------------------------------- |
| 為何選 SaaS 訂閱             | 比一般商城更適合展示帳務、訂閱、付款與權限流程 |
| 為何用 Route Handler 模擬    | 不依賴真後端，但保留真實 API flow              |
| 為何假設 httpOnly Cookie     | 避免 token 暴露於 client-side JavaScript       |
| 為何用 Zod + React Hook Form | 集中管理表單驗證與型別                         |
| 為何用 TanStack Query        | 管理 server state、loading、error、retry       |
| 為何用 Zustand               | 管理少量 client-side 結帳 / UI 狀態            |
| 為何做安全回調 URL           | 避免 open redirect                             |
| 為何實作 CSP                 | 展示基本資安 header 意識                       |
| 為何要寫測試                 | 驗證付款、callback、價格、訂閱狀態等核心邏輯   |

---

## 面試說法

```txt
SecureCart 是我做的一個 SaaS 訂閱結帳 side project。

我沒有把它做成一般商品商城，而是聚焦在更接近真實 B2B / SaaS 產品會遇到的流程，
例如訂閱方案、結帳、模擬信用卡 Tokenization、訂閱管理、帳單紀錄、
受保護路由、安全回調 URL、CSP、表單驗證與 CI 品質把關。

這個專案的目的不是展示單純切版，
而是展示我如何設計一個可維護、有資安意識、接近實務情境的 Next.js App Router 前端架構。
```

---

## 開發優先順序

### 第一階段：專案基礎

- 建立 Next.js App Router 專案
- 設定 pnpm
- 建立基本路由
- 建立主題 / 版型
- 建立模擬資料
- 建立共用 Button / Card / Input 元件

### 第二階段：方案頁 + 結帳

- 訂閱方案列表
- 月繳 / 年繳切換
- 結帳步驟
- 帳務資訊表單
- 模擬付款方式
- 結帳結果頁

### 第三階段：帳務管理

- 帳務總覽
- 目前訂閱狀態
- 付款方式管理
- 帳單紀錄
- 取消訂閱
- 升級 / 降級方案

### 第四階段：資安 + 測試

- 安全回調 URL
- CSP header 模擬
- 受保護路由守衛
- Vitest 測試
- 價格計算測試
- 結帳驗證測試

### 第五階段：完善細節

- 載入骨架屏
- 錯誤狀態
- 空狀態
- Toast / Snackbar 提示
- 響應式版面
- README
- Demo 截圖
- 部署上線

---

## 最終目標

SecureCart 要讓面試官看到：

```txt
我不是只會做畫面，
我能設計接近真實產品的前端架構，
包含登入、付款、訂閱、帳務、資安、狀態管理、測試與維護性。
```
