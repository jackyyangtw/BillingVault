/**
 * Session 管理工具
 *
 * 負責將後端回傳的 token 存入/讀取/刪除 HttpOnly cookie。
 * 前端不做加密解密，token 的簽發和驗證完全由後端負責。
 *
 * @module lib/auth/session
 */
import "server-only";

import { cookies } from "next/headers";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

// ---------------------------------------------------------------------------
// Cookie Operations
// ---------------------------------------------------------------------------

/** 建立 session：將後端 token 直接存入 HttpOnly cookie */
export async function createSession(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/** 取得 session token（從 cookie 讀取） */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/** 續期 session：延長 cookie 有效期限 */
export async function updateSession(): Promise<void> {
  const token = await getSession();

  if (!token) return;

  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

/** 刪除 session cookie（登出用） */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
