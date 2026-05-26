import { NextResponse } from "next/server";

export function createProxyRequestHeaders(
  requestHeaders: Headers,
  nonce: string,
  contentSecurityPolicy: string,
): Headers {
  const headers = new Headers(requestHeaders);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", contentSecurityPolicy);
  return headers;
}

export function applyCspHeaders(
  response: NextResponse,
  contentSecurityPolicy: string,
): NextResponse {
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export function createNextResponse(
  requestHeaders: Headers,
  contentSecurityPolicy: string,
): NextResponse {
  return applyCspHeaders(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
    contentSecurityPolicy,
  );
}

function copySessionCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });

  const cacheControl = source.headers.get("Cache-Control");
  const expires = source.headers.get("Expires");
  const pragma = source.headers.get("Pragma");

  if (cacheControl) target.headers.set("Cache-Control", cacheControl);
  if (expires) target.headers.set("Expires", expires);
  if (pragma) target.headers.set("Pragma", pragma);
}

export function createRedirectResponse(
  url: URL,
  sourceResponse: NextResponse,
  contentSecurityPolicy: string,
): NextResponse {
  const redirectResponse = NextResponse.redirect(url);
  copySessionCookies(sourceResponse, redirectResponse);
  return applyCspHeaders(redirectResponse, contentSecurityPolicy);
}
