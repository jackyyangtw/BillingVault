---
description: 每次修改程式碼前必須執行的前置檢查清單
---

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

## 4. 元件結構檢查（200 行拆分規則）

修改完成後，檢查目標元件檔案是否超過 **200 行**。若超過，必須將其拆分為資料夾結構：

- 將內部子元件（`function` 宣告的 React 元件）拆為獨立 `.tsx` 檔
- 將工具函式（如 `formatCurrency`）拆為 `utils.ts`
- 主元件改為 `index.tsx`，負責組合與業務邏輯
- 外部 import 路徑維持不變（資料夾 `index.tsx` 自動解析）

> 完整規範與範例請參閱 [CREATE_COMPONENT.md](../../docs/Components/CREATE_COMPONENT.md) 的「200 行拆分規則」章節。

## 5. 確認後再動手

說明你查到了什麼、打算怎麼改。

[新增] 預測修改後 React DevTools 是否會顯示 "Memo ✨" 標籤，若會導致 Bail-out（優化失效），必須說明原因。

取得使用者確認後再開始修改。
