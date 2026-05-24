/**
 * Proxy — 路由守衛 + Content Security Policy（Next.js 16）
 *
 * 在每次請求時：
 * 1. 產生 CSP nonce，注入 Content-Security-Policy header
 * 2. 檢查 session cookie 是否存在（樂觀檢查）：
 *    - 未登入者訪問 protected 路徑 → redirect `/login`
 *    - 已登入者訪問 auth 路徑（如 `/login`）→ redirect `/checkout`
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
const protectedRoutePrefixes = [
  "/checkout",
  "/account",
  "/payment",
  "/subscription",
];

/** 已登入用戶應被導離的路徑（避免重複登入） */
const guestOnlyRoutes = ["/login"];

// ---------------------------------------------------------------------------
// Proxy Function
// ---------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 每次請求產生唯一 nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const contentSecurityPolicy = buildCspHeader(nonce);

  // 樂觀檢查：cookie 有值就當作已登入
  const sessionCookie = request.cookies.get("session")?.value;
  const isAuthenticated = !!sessionCookie;

  // 未登入 → 訪問 protected 路徑 → redirect 到 /login（帶 callbackUrl）
  const isProtectedRoute = protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.nextUrl);
    const callbackUrl = pathname + request.nextUrl.search;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);

    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicy,
    );
    return redirectResponse;
  }

  // 已登入 → 訪問 /login → redirect 到 /checkout
  const isGuestOnlyRoute = guestOnlyRoutes.includes(pathname);
  if (isGuestOnlyRoute && isAuthenticated) {
    const redirectResponse = NextResponse.redirect(
      new URL("/checkout", request.nextUrl),
    );
    redirectResponse.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicy,
    );
    return redirectResponse;
  }

  // 未登入 → 訪問 /login → 驗證 callbackUrl 安全性（防止 Open Redirect）
  if (isGuestOnlyRoute && !isAuthenticated) {
    const rawCallback = request.nextUrl.searchParams.get("callbackUrl");
    if (rawCallback && !isSafeCallbackUrl(rawCallback)) {
      const safeUrl = new URL("/login", request.nextUrl);
      // 移除惡意 callbackUrl，直接導向乾淨的 /login
      const redirectResponse = NextResponse.redirect(safeUrl);
      redirectResponse.headers.set(
        "Content-Security-Policy",
        contentSecurityPolicy,
      );
      return redirectResponse;
    }
  }

  // 正常放行 — 注入 CSP header 與 nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

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
