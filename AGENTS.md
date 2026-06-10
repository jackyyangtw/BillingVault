<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# 修改前置檢查流程

在修改任何程式碼之前，必須依序完成以下步驟：

## 1. 查閱專案文件與索引

遵循專案根目錄 AGENTS.md 的指示。

特別注意 React 19 / Next.js 16 的新技術規範與 Breaking Changes。

## 2. React Compiler 靜態檢查（核心規範）

在動手前，AI 必須自我檢視是否符合 eslint-plugin-react-compiler 的 Purity 要求：

[純粹性檢查]：確保元件渲染過程中沒有任何 Side Effects（不修改全域變數、不直接變異 Props/State）。

[引用穩定性]：確認所有傳遞給子元件的物件或函式，在資料未變動時保持相同的 Reference（避免 Compiler 無法自動 memoization）。

[Ref 使用規範]：嚴禁在 Render 期間讀取或寫入 ref.current。

[Hook 擺放]：確保 Hook 只出現在最頂層，絕無條件式呼叫（避免 Compiler 優化失敗）。

## 3. 檢查專案現有模式與品質

[元件命名]：禁止使用匿名元件，確保 DevTools 顯示具名元件而非 Anonymous。

[狀態管理]：優先檢查是否能用 Derived State（衍生狀態）解決，嚴禁為了同步狀態而在 useEffect 裡 setState（這會導致 Compiler 負擔過重）。

[Import 路徑]：相對路徑最多只允許到 `../../`。若需要 `../../../` 或更深層級，必須改用 `@/` alias，避免深層相對路徑降低可讀性與維護性。

[Barrel 檔案]：禁止新增 barrel 檔案（例如 `index.ts` 只用來 re-export 其他模組）。Import 必須指向實際功能檔案，例如 `@/lib/payment-methods/dal/listPaymentMethods`，避免透過資料夾入口隱藏依賴來源。既有 barrel 若因重構碰到，應優先移除並改成明確 import。

## Util Function 拆分與共用規則

處理 `utils.ts`、`_utils/` 或任何 helper function 時，必須先檢查使用面，再決定放置位置：

1. **只被單一 component 或 hook 使用**：不要獨立成 `_utils` 檔案。將 function 放回該 component / hook 檔案底部，維持 module scope 的具名 function，避免在 render 或 hook body 內重新建立。
2. **被同一 component 資料夾內多個子元件共用**：放在該 component 資料夾最近共同父層的 `utils.ts`，例如 `CheckoutForm/utils.ts`。Import 必須指向實際檔案，不得新增 `index.ts` barrel。
3. **被兩個以上不同 route、feature 或跨資料夾模組共用**：提升到明確的共用位置，例如 `src/utils/formatDate.ts` 或既有 domain lib。必須一個概念一個檔案，避免把不相關 helper 合併成大型 `utils.ts`。
4. **元件超過 200 行時**：依「200 行拆分規則」改成資料夾結構；僅被該元件使用的 util 放在該元件資料夾內的 `utils.ts`，外部 import 路徑維持不變。
5. **不可為了測試而保留獨立 util**：若 helper 沒有共用需求，優先透過使用它的 component / hook 行為測試覆蓋。
6. **React Compiler 注意事項**：helper 必須保持純函式；不得在 helper 或 render 過程中修改 props/state/global，也不得讀寫 `ref.current`。

## 測試命名規範

- 所有 unit test / integration test / e2e test 的 `describe()`、`it()`、`test()` 描述文字必須使用繁體中文。
- 測試名稱應描述使用者可理解的行為，而不是只描述實作細節。
- 範例：
  - ✅ `it("訂閱不存在時拒絕取消")`
  - ❌ `it("rejects when subscription is missing")`

## 4. 元件結構檢查（200 行拆分規則）

修改完成後，檢查目標元件檔案是否超過 **200 行**。若超過，必須將其拆分為資料夾結構：

- 將內部子元件（`function` 宣告的 React 元件）拆為獨立 `.tsx` 檔
- 將工具函式（如 `formatCurrency`）拆為 `utils.ts`
- 主元件改為 `index.tsx`，負責組合與業務邏輯
- 外部 import 路徑維持不變（資料夾 `index.tsx` 自動解析）

> 完整規範與範例請參閱 [CREATE_COMPONENT.md](/docs/Components/CREATE_COMPONENT.md) 的「200 行拆分規則」章節。

## 5. 確認後再動手

說明你查到了什麼、打算怎麼改。

[新增] 預測修改後 React DevTools 是否會顯示 "Memo ✨" 標籤，若會導致 Bail-out（優化失效），必須說明原因。

取得使用者確認後再開始修改。

## Prisma + Supabase Migration 規則

本專案使用 Prisma 管理 Supabase PostgreSQL schema。

當任務涉及 Supabase 後台警告、RLS、policy、schema、migration、table、index、constraint 或資料庫安全設定時：

1. 不只新增 migration 檔案。
2. 新增 migration 後必須執行 `npx prisma migrate deploy`，將 migration 實際套用到 Supabase。
3. deploy 後必須執行 `npx prisma migrate status` 確認 `Database schema is up to date!`。
4. 若修的是 Supabase Advisor 警告，應說明 Supabase 後台可能需要刷新或重新執行 Advisor。
5. 除非使用者明確要求只產生檔案，否則 migration 任務視為「新增並部署」。
