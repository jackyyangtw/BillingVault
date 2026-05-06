/**
 * Proxy — 路由守衛 + Content Security Policy（Next.js 16）
 *
 * 在每次請求時：
 * 1. 產生 CSP nonce，注入 Content-Security-Policy header
 * 2. 檢查 session cookie 是否存在（樂觀檢查）：
 *    - 未登入者訪問 protected 路徑 → redirect `/login`
 *    - 已登入者訪問 auth 路徑（如 `/login`）→ redirect `/account`
 *    - 其他路由正常放行
 *
 * 安全措施：
 * - CSP 限制 script / style / frame 來源，防止 XSS 與 code injection
 * - callbackUrl 必須是同站相對路徑，防止 Open Redirect 攻擊
 *
 * 注意：這裡只做樂觀檢查（cookie 是否存在），不驗證 token 有效性。
 * Token 的驗證由後端 API 在實際資料請求時負責。
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isSafeCallbackUrl } from "@/proxy/isSafeCallbackUrl";
import { buildCspHeader } from "@/proxy/buildCspHeader";

// ---------------------------------------------------------------------------
// Route Definitions
// ---------------------------------------------------------------------------

/** 需要登入才能訪問的路徑前綴 */
const protectedPrefixes = ["/checkout"];

/** 已登入用戶應被導離的路徑（避免重複登入） */
const authRoutes = ["/login"];

// ---------------------------------------------------------------------------
// Proxy Function
// ---------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 每次請求產生唯一 nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeaderValue = buildCspHeader(nonce);

  // 樂觀檢查：cookie 有值就當作已登入
  const sessionCookie = request.cookies.get("session")?.value;
  const isAuthenticated = !!sessionCookie;

  // 未登入 → 訪問 protected 路徑 → redirect 到 /login（帶 callbackUrl）
  const isProtected = protectedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(prefix + "/"),
  );
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.nextUrl);
    const callbackUrl = path + request.nextUrl.search;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);

    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.headers.set("Content-Security-Policy", cspHeaderValue);
    return redirectRes;
  }

  // 已登入 → 訪問 /login → redirect 到 /account
  const isAuthRoute = authRoutes.includes(path);
  if (isAuthRoute && isAuthenticated) {
    const redirectRes = NextResponse.redirect(
      new URL("/account", request.nextUrl),
    );
    redirectRes.headers.set("Content-Security-Policy", cspHeaderValue);
    return redirectRes;
  }

  // 未登入 → 訪問 /login → 驗證 callbackUrl 安全性（防止 Open Redirect）
  if (isAuthRoute && !isAuthenticated) {
    const rawCallback = request.nextUrl.searchParams.get("callbackUrl");
    if (rawCallback && !isSafeCallbackUrl(rawCallback)) {
      const safeUrl = new URL("/login", request.nextUrl);
      // 移除惡意 callbackUrl，直接導向乾淨的 /login
      const redirectRes = NextResponse.redirect(safeUrl);
      redirectRes.headers.set("Content-Security-Policy", cspHeaderValue);
      return redirectRes;
    }
  }

  // 正常放行 — 注入 CSP header 與 nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeaderValue);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", cspHeaderValue);

  return response;
}

// ---------------------------------------------------------------------------
// Matcher — 排除靜態資源和 API 路由
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
