/** 需要登入才能訪問的路徑前綴 */
const protectedRoutePrefixes = ["/checkout", "/account"];

/** 已登入用戶應被導離的路徑（避免重複登入） */
const guestOnlyRoutes = ["/login"];

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

export function isGuestOnlyRoute(pathname: string): boolean {
  return guestOnlyRoutes.includes(pathname);
}
