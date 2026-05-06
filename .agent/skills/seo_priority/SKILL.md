---
name: seo_priority
description: SEO 是本專案的最高優先事項之一。所有頁面與元件的開發都必須遵守 SEO 最佳實踐。
---

# SEO 優先策略

本專案（ua-store）是優分析商城的官方網站，SEO 對於產品曝光與自然流量至關重要。**所有開發工作都必須將 SEO 納入考量，尤其是 public route group 下的頁面，這些頁面將會被爬蟲抓取。**

> **📖 權威來源**：本技能的規則基於 `node_modules/next/dist/docs/` 中的官方文件。若有疑義，以該目錄下的文件為準。

---

## 強制執行項目

### 1. Metadata（每個頁面必備）

- 每個 `page.tsx` 都必須 export `metadata` 或使用 `generateMetadata`
- `metadata` 和 `generateMetadata` **僅在 Server Components 中支援**
- 包含：`title`、`description`、`openGraph`、`twitter` 等欄位
- Title 格式：`頁面名稱 | 優分析 UAnalyze`
- Description 需具體描述頁面內容，100-160 字元

**靜態 Metadata（首選，適用於內容固定的頁面）：**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "優分析產業資料庫 | AI智慧投資分析平台",
  description: "整合 AI Insight、15年基本面指標、估值模型與選股策略...",
  openGraph: {
    title: "優分析產業資料庫 | AI智慧投資分析平台",
    description: "整合 AI Insight、15年基本面指標、估值模型與選股策略...",
    images: ["/og-image.jpg"],
  },
};
```

**動態 Metadata（適用於依賴資料的頁面，如產品詳情頁）：**

```tsx
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProduct(slug);

  return {
    title: `${product.name} | 優分析 UAnalyze`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}
```

> **注意**：`params` 在此版本中是 `Promise`，必須 `await` 取得值。使用 `react` 的 `cache()` 函式避免 `generateMetadata` 與頁面元件重複請求同一資料。

### 2. 文件型 Metadata（File-based Metadata）

除了程式碼定義的 metadata，以下特殊檔案會被 Next.js 自動處理：

| 檔案                  | 用途             | 放置位置            |
| --------------------- | ---------------- | ------------------- |
| `favicon.ico`         | 瀏覽器分頁圖示   | `app/` 根目錄       |
| `opengraph-image.jpg` | 社群分享預覽圖   | `app/` 或各路由目錄 |
| `robots.txt`          | 搜尋引擎爬蟲規則 | `app/` 根目錄       |
| `sitemap.xml`         | 網站地圖         | `app/` 根目錄       |
| `manifest.json`       | PWA 清單         | `app/` 根目錄       |

- 確保 `robots.txt` 和 `sitemap.xml` 已建立（可用靜態檔案或 `generateSitemaps` 動態產生）
- `opengraph-image` 可放在各路由目錄裡，越深層的會覆蓋上層的
- 支援動態 OG 圖片：建立 `opengraph-image.tsx`，使用 `ImageResponse`（from `next/og`）產生

### 3. 語意化 HTML 結構

- 每頁只能有**一個 `<h1>`**
- 標題層級必須依序：`h1 > h2 > h3`，不可跳級
- 使用語意標籤：`<header>`、`<main>`、`<section>`、`<article>`、`<footer>`、`<nav>`、`<figure>`、`<figcaption>`
- 避免純裝飾用的空 `<div>` 包裹，優先使用語意標籤

### 4. 圖片最佳化

- 所有圖片使用 Next.js `<Image>` 元件（`next/image`）
- 必須提供有意義的 `alt` 文字（描述圖片內容，非裝飾用途）
- 設定適當的 `sizes` 屬性以支援 responsive loading
- **LCP 圖片**加上 `priority` prop（會自動注入 `<link rel="preload">`）
- 其餘圖片預設 lazy loading（瀏覽器原生）
- 靜態 import 圖片時，`width`/`height`/`blurDataURL` 會自動推導
- 遠端圖片必須手動提供 `width`/`height`，並在 `next.config` 的 `images.remotePatterns` 設定允許的來源
- 使用 `fill` prop 時，父容器必須設定 `position: relative`

### 5. 結構化資料（JSON-LD）

- 產品頁使用 `Product` schema
- 定價頁使用 `AggregateOffer` schema
- 文章/課程頁使用 `Course` 或 `Article` schema
- 在 `page.tsx` 或 `layout.tsx` 中以原生 `<script>` 標籤渲染（**不使用** `next/script`，JSON-LD 是結構化資料非可執行腳本）
- **必須防止 XSS**：將 `<` 字元替換為 `\u003c`

```tsx
export default async function Page({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* ... */}
    </section>
  );
}
```

> **TypeScript 型別提示**：可使用 `schema-dts` 套件提供 JSON-LD 類型。

### 6. 連結與導航

- 內部連結使用 Next.js `<Link>` 元件
- 外部連結加上 `target="_blank"` 和 `rel="noopener noreferrer"`
- 確保所有導航連結可被爬蟲抓取（非純 JavaScript 渲染）
- 錨點連結需有對應的 `id`

### 7. 效能與 Core Web Vitals

效能直接影響 SEO 排名。以下規則對應 Google 的 Core Web Vitals 指標：

**CLS（Cumulative Layout Shift）：**

- 圖片設定固定尺寸或 `aspect-ratio`
- Suspense fallback 的尺寸應與最終內容匹配
- 使用 `min-height` 容器包裹 `<Suspense>` 區域預留空間

**LCP（Largest Contentful Paint）：**

- 首屏關鍵內容盡早渲染
- LCP 元素（主標題、主圖）應位於 `<Suspense>` 邊界**之外**，作為 static shell 的一部分
- LCP 圖片使用 `<Image priority />` 自動注入 preload
- 使用 Next.js `Font Module` 載入字型，避免 layout shift

**INP（Interaction to Next Paint）：**

- 善用 `<Suspense>` 邊界實現 selective hydration
- 每個 `<Suspense>` 是一個獨立的 hydration 單元

**JS Bundle 最小化：**

- 預設使用 Server Components
- 只在需要互動（`useState`、`useEffect`）、瀏覽器 API、event handler 時才使用 `"use client"`
- `"use client"` 應設定在最小粒度的互動元件上，而非整個頁面或大型佈局

### 8. Streaming 與 SEO 的交互

- `generateMetadata` 對 bot（Twitterbot、Slackbot、Bingbot）會在 streaming 開始前解析完畢
- 一般瀏覽器中 metadata 可與頁面內容同步 streaming
- 可透過 `next.config.js` 的 `htmlLimitedBots` 設定自訂哪些 bot 接收阻塞式 metadata
- 若在 streaming 開始後呼叫 `notFound()`，HTTP status 無法變更為 404，Next.js 會改為注入 `<meta name="robots" content="noindex">`
- **最佳實踐**：將 `notFound()` 放在任何 `await` 或 `<Suspense>` 之前，以確保回傳正確的 HTTP 404 狀態碼

### 9. 無障礙（Accessibility = SEO 加分）

- 互動元素設定 `aria-label`
- 表單元素搭配 `<label>`
- 確保鍵盤可操作
- 色彩對比度符合 WCAG AA 標準
- 使用內建 `eslint-plugin-jsx-a11y` 提早捕捉無障礙問題

---

## 檢查清單（每次建立新頁面時）

### 必須完成

- [ ] 設定 `metadata`（title + description + OG）— 僅在 Server Component 中
- [ ] 單一 `<h1>`，標題層級正確
- [ ] 圖片全部使用 `<Image>` + 有意義的 `alt`
- [ ] 語意化 HTML 標籤
- [ ] 結構化資料 JSON-LD（如適用）— 使用原生 `<script>` + XSS 防護
- [ ] LCP 圖片設定 `priority`
- [ ] LCP 元素位於 `<Suspense>` 邊界之外
- [ ] 外部連結有 `rel="noopener noreferrer"`
- [ ] `notFound()` 呼叫在 `<Suspense>` 之前

### 專案層級（一次性設定）

- [ ] `robots.txt` 已建立
- [ ] `sitemap.xml` 已建立
- [ ] `favicon.ico` 已放置於 `app/` 根目錄
- [ ] `opengraph-image` 已建立（至少根目錄一張）
- [ ] 遠端圖片來源已在 `next.config` 的 `images.remotePatterns` 中設定
