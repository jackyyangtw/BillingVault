/**
 * Proxy — 路由守衛 + Content Security Policy（Next.js 16）
 *
 * 在每次請求時：
 * 1. 產生 CSP nonce，注入 Content-Security-Policy header
 * 2. 檢查 Supabase session：
 *    - 未登入者訪問 protected 路徑 → redirect `/login`
 *    - 已登入者訪問 auth 路徑（如 `/login`）→ redirect `/checkout`
 *    - 其他路由正常放行
 *    - 透過 Supabase SSR client 刷新 Auth session cookie
 *
 * 安全措施：
 * - CSP 限制 script / style / frame 來源，防止 XSS 與 code injection
 * - callbackUrl 必須是同站相對路徑，防止 Open Redirect 攻擊
 * - Server Action / Server Component 仍會重新驗證 Supabase session
 */
import type { NextRequest } from "next/server";

import { isSafeCallbackUrl } from "@/proxy/helpers/isSafeCallbackUrl";
import { buildCspHeader } from "@/proxy/helpers/buildCspHeader";
import { isGuestOnlyRoute, isProtectedRoute } from "@/proxy/routes";
import {
  createNextResponse,
  createProxyRequestHeaders,
  createRedirectResponse,
} from "@/proxy/response";
import { resolveSupabaseProxySession } from "@/proxy/supabaseProxy";

// ---------------------------------------------------------------------------
// Proxy Function
// ---------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 每次請求產生唯一 nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const contentSecurityPolicy = buildCspHeader(nonce);
  const requestHeaders = createProxyRequestHeaders(
    request.headers,
    nonce,
    contentSecurityPolicy,
  );

  const { response, isAuthenticated } = await resolveSupabaseProxySession({
    request,
    response: createNextResponse(requestHeaders, contentSecurityPolicy),
    requestHeaders,
    contentSecurityPolicy,
  });

  // 未登入 → 訪問 protected 路徑 → redirect 到 /login（帶 callbackUrl）
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.nextUrl);
    const callbackUrl = pathname + request.nextUrl.search;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);

    return createRedirectResponse(loginUrl, response, contentSecurityPolicy);
  }

  // 已登入 → 訪問 /login → redirect 到 /checkout
  if (isGuestOnlyRoute(pathname) && isAuthenticated) {
    return createRedirectResponse(
      new URL("/checkout", request.nextUrl),
      response,
      contentSecurityPolicy,
    );
  }

  // 未登入 → 訪問 /login → 驗證 callbackUrl 安全性（防止 Open Redirect）
  if (isGuestOnlyRoute(pathname) && !isAuthenticated) {
    const rawCallback = request.nextUrl.searchParams.get("callbackUrl");
    if (rawCallback && !isSafeCallbackUrl(rawCallback)) {
      const safeUrl = new URL("/login", request.nextUrl);
      // 移除惡意 callbackUrl，直接導向乾淨的 /login
      return createRedirectResponse(safeUrl, response, contentSecurityPolicy);
    }
  }

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
