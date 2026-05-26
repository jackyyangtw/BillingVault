/**
 * Content Security Policy — 可信任域名清單
 *
 * 集中管理 CSP 各指令的外部域名白名單。
 * 新增第三方服務時，只需修改此檔案，無需動 proxy 邏輯。
 *
 * @example
 * 新增 Google Analytics：
 * ```ts
 * scriptSrc: [..., "https://www.googletagmanager.com"],
 * connectSrc: [..., "https://www.google-analytics.com"],
 * ```
 *
 * @module settings/csp
 */

/**
 * CSP 各指令的外部域名白名單
 *
 * - `scriptSrc`：允許載入 JS 的外部域名
 * - `imgSrc`：允許載入圖片的外部域名
 * - `connectSrc`：允許 XHR/fetch/WebSocket 的外部域名
 * - `frameSrc`：允許嵌入 iframe 的外部域名
 */
export const cspTrustedDomains = {
  /** 允許載入 script 的域名（TapPay SDK） */
  scriptSrc: ["https://js.tappaysdk.com"],

  /** 允許載入圖片的域名（產品圖片 CDN） */
  imgSrc: [],

  /** 允許 fetch/XHR 連線的域名（TapPay API） */
  connectSrc: ["https://js.tappaysdk.com"],

  /** 允許嵌入 iframe 的域名（TapPay 信用卡欄位） */
  frameSrc: ["https://*.tappaysdk.com"],
} as const;
