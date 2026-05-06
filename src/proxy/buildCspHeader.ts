/**
 * CSP Header Builder
 *
 * 組裝 Content-Security-Policy header 值。
 * 可信任域名清單定義在 `@/settings/csp`，本模組負責將其組裝為合法的 CSP 字串。
 *
 * @module proxy/buildCspHeader
 */

import { cspTrustedDomains } from "@/settings/csp";

/**
 * 產生含 nonce 的 CSP header 值
 *
 * - `strict-dynamic`：允許被 nonce 授權的腳本再動態載入子腳本
 * - 開發環境額外加 `unsafe-eval`（React dev 需要）
 */
export function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const { scriptSrc, imgSrc, connectSrc, frameSrc } = cspTrustedDomains;

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${scriptSrc.join(" ")}${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ${imgSrc.join(" ")};
    font-src 'self';
    connect-src 'self' ${connectSrc.join(" ")};
    frame-src 'self' ${frameSrc.join(" ")};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  return csp.replace(/\s{2,}/g, " ").trim();
}
