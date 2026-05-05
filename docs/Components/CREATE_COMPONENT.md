# 元件建立規範 (Component Creation Guide)

本文件說明專案中元件的放置位置、命名方式與組織原則。

## 核心原則：就近放置 (Colocation)

> **元件應該放在最接近使用它的地方。**
> 只有當元件被多個不相關的模組共用時，才應該往上提升。

---

## 元件分類與放置位置

### 1. Route 專屬元件 → `_components/`

若元件**只服務於某個特定 route**，則放在該 route 目錄底下的 `_components/` 資料夾。

Next.js 中，以 `_` 開頭的資料夾不會被當作 route segment，因此 `_components/` 是存放私有元件的標準方式。

```
src/app/
├── page.tsx                          ← 首頁 (/)
├── _components/                      ← 首頁專屬元件
│   ├── HeroSection.tsx               ← 簡單元件，單一檔案即可
│   ├── PricingSection.tsx
│   ├── RawMaterialsSection.tsx
│   ├── FeatureSection/               ← 複雜元件，拆成資料夾
│   │   ├── index.tsx                 ← 主元件（外部 import 入口）
│   │   └── FeatureBlock.tsx          ← 內部子元件
│   └── CrossSellSection/
│       ├── index.tsx
│       └── ReportCard.tsx
├── login/
│   ├── page.tsx                      ← 登入頁 (/login)
│   └── _components/                  ← 登入頁專屬元件
│       └── LoginForm.tsx
```

**規則：**

- 資料夾命名使用 **PascalCase**（例：`FeatureSection/`）
- 主元件使用 `index.tsx` 作為進入點
- 子元件放在同資料夾內，以 PascalCase 命名
- `_components/` 內的元件**不應被其他 route 引用**

### 2. Layout 共用元件 → `_components/layout/`

全站共用的 layout 元件（Navbar、Footer、Sidebar 等），放在根 `_components/layout/` 內，由 `layout.tsx` 引入。

```
src/app/
├── layout.tsx                        ← 引入 Navbar + Footer
├── _components/
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
```

### 3. 全域共用 UI 原件 → `src/components/`

跨 route 共用的通用 UI 元件，不屬於特定業務邏輯：

```
src/components/
├── ui/                               ← 基礎 UI 原件 (shadcn/ui 管理)
│   ├── button.tsx
│   ├── card.tsx
│   ├── container.tsx
│   ├── dialog.tsx
│   └── alert.tsx
└── template/                         ← 可複用的組合模板
```

**規則：**

- `src/components/ui/` 由 shadcn/ui CLI 管理，勿手動新增
- 只有被 **2 個以上不同 route** 使用的元件才放在這裡
- 先在 `_components/` 開發，確認需要共用後再提升至此

---

## 判斷元件該放在哪裡

```
這個元件只有一個 route 在用嗎？
├── YES → 放在該 route 的 _components/ 資料夾
│         它有子元件嗎？
│         ├── YES → 建立資料夾 + index.tsx
│         └── NO  → 單一 .tsx 檔案即可
│
└── NO → 它是 layout 元件嗎？（Navbar/Footer/Sidebar）
         ├── YES → 放在 _components/layout/
         └── NO  → 放在 src/components/
```

---

## 元件檔案結構

### 簡單元件（無子元件）

直接以 `ComponentName.tsx` 命名，放在 `_components/` 底下：

```tsx
// _components/HeroSection.tsx
export default function HeroSection() {
  return <header>...</header>;
}
```

### 複雜元件（有子元件）

建立同名資料夾，搭配 `index.tsx`：

```
_components/
└── CrossSellSection/
    ├── index.tsx          ← export default function CrossSellSection
    └── ReportCard.tsx     ← 內部使用的子元件
```

```tsx
// CrossSellSection/index.tsx
import ReportCard from "./ReportCard";

export default function CrossSellSection() {
  return (
    <section>
      {reports.map((r) => (
        <ReportCard key={r.title} {...r} />
      ))}
    </section>
  );
}
```

外部引用時路徑保持簡潔：

```tsx
// page.tsx
import CrossSellSection from "./_components/CrossSellSection";
```

### 200 行拆分規則

> **當單一元件檔案超過 200 行時，必須拆分為資料夾結構。**

將內部的子元件、工具函式各自獨立成檔案，主元件只負責組合與業務邏輯。

**拆分原則：**

- 內部 `function` 元件（如 `StatusDot`、`SectionLabel`）→ 獨立 `.tsx` 檔
- 工具 / 格式化函式（如 `formatCurrency`）→ 獨立 `utils.ts`
- 型別定義如已在外部 `_types/` → 維持原位，不需搬入資料夾

### 遞迴式資料夾嵌套 (Recursive Folder-per-Component)

> **當子元件本身也擁有子元件時，遞迴套用相同的「資料夾 + index.tsx」結構。**

此模式確保每一層元件的內部細節都被封裝在自己的資料夾中，
外部始終透過 `import Foo from "./Foo"` 引用，無需關心內部結構。

**判斷是否需要嵌套：**

```
這個子元件有自己的子元件嗎？
├── YES → 建立同名資料夾 + index.tsx，子元件放入資料夾內
└── NO  → 維持單一 .tsx 檔案
```

**範例：`ActiveSubscriptionCard`**

拆分前（單一檔案，超過 200 行）：

```
_components/
└── ActiveSubscriptionCard.tsx    ← 包含 StatusDot、SectionLabel、
                                     DetailRow、formatCurrency 等
```

拆分後（遞迴嵌套）：

```
_components/
└── ActiveSubscriptionCard/
    ├── index.tsx              ← 主元件（純組合，匯入子元件）
    ├── StatusHeader/          ← 子元件有自己的子元件 → 資料夾
    │   ├── index.tsx          ← 狀態列 + Badge
    │   └── StatusDot.tsx      ← 脈衝動畫圓點（僅此處使用）
    ├── PlanDetails.tsx        ← 無子元件 → 單一檔案
    ├── BillingDetails/        ← 子元件有自己的子元件 → 資料夾
    │   ├── index.tsx          ← 合約與計費週期
    │   └── DetailRow.tsx      ← 明細行（僅此處使用）
    ├── FooterActions.tsx      ← "use client"（Dialog + toast 邏輯）
    ├── SectionLabel.tsx       ← 共用小標（多個子元件使用）
    └── utils.ts               ← formatCurrency 等工具函式
```

```tsx
// ActiveSubscriptionCard/index.tsx — 純組合，無業務邏輯
import StatusHeader from "./StatusHeader";
import PlanDetails from "./PlanDetails";
import BillingDetails from "./BillingDetails";
import FooterActions from "./FooterActions";

export default function ActiveSubscriptionCard({ subscription }) {
  const isExpiring = subscription.status === "expiring";

  return (
    <Card>
      <StatusHeader isExpiring={isExpiring} />
      <CardContent>
        <PlanDetails subscription={subscription} />
        <BillingDetails subscription={subscription} isExpiring={isExpiring} />
      </CardContent>
      <FooterActions subscription={subscription} isExpiring={isExpiring} />
    </Card>
  );
}
```

**關鍵規則：**

- 共用的子元件（如 `SectionLabel`、`utils.ts`）放在**最近的共同父層**
- 僅被單一元件使用的子元件放入**該元件的資料夾內**
- `"use client"` 只標記在真正需要互動的元件上，其餘保持 Server Component

外部引用方式不變：

```tsx
import ActiveSubscriptionCard from "./_components/ActiveSubscriptionCard";
```

---

## 命名規範

| 類型           | 命名方式                  | 範例                                    |
| -------------- | ------------------------- | --------------------------------------- |
| 元件檔案       | PascalCase                | `HeroSection.tsx`                       |
| 元件資料夾     | PascalCase                | `FeatureSection/`                       |
| 元件資料夾入口 | `index.tsx`               | `FeatureSection/index.tsx`              |
| Export 方式    | `export default function` | `export default function HeroSection()` |
| 私有元件目錄   | `_components/`            | `src/app/_components/`                  |

---

## 其他注意事項

- 優先使用 **Server Component**，只在需要互動（state、effect、event handler）時加上 `"use client"`
- 元件內的 icon 統一使用 `lucide-react`，避免 inline SVG（[ICON查詢](https://lucide.dev/icons/)）
- 圖片統一使用 Next.js `<Image>` 元件
- 樣式使用 Tailwind CSS，搭配 `src/components/ui/` 提供的設計原件
