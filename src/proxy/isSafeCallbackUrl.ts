/**
 * 驗證 callbackUrl 是否為安全的同站相對路徑。
 * 阻擋 Open Redirect 攻擊向量：
 * - 絕對 URL（https://evil.com）
 * - Protocol-relative URL（//evil.com）
 * - 反斜線繞過（\/evil.com → 部分瀏覽器會解讀為 //evil.com）
 */
export function isSafeCallbackUrl(url: string): boolean {
  if (url === "/") return true;
  // 必須以 "/" 開頭，且第二個字元不是 "/" 或 "\"
  return /^\/[^/\\]/.test(url);
}
