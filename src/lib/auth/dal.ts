/**
 * Data Access Layer (DAL)
 *
 * 給 Server Component 使用的驗證層。
 * 使用 React `cache` 避免同一次 render 中重複讀取 cookie。
 *
 * 注意：目前 getCurrentUser 使用 mock 資料。
 * 接入後端後，應改為帶 token 呼叫後端 API 取得用戶資料。
 *
 * @module lib/auth/dal
 */
import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { UserProfile } from "./types";

// ---------------------------------------------------------------------------
// 模擬的 user 資料（未來改為帶 token 呼叫後端 API）
// ---------------------------------------------------------------------------

const MOCK_USER_DB: Record<string, UserProfile> = {
  "user-securecart-demo": {
    id: "user-securecart-demo",
    name: "林品安",
    email: "demo@securecart.dev",
    phone: "0918-246-135",
  },
  // 綁定 Email 後的新用戶（token: mock-jwt-token-bind-{provider}）
  "bind-Google": {
    id: "user-new-google",
    name: "Google 試用成員",
    email: "google.member@securecart.dev",
    phone: "0936-582-714",
  },
  "bind-Facebook": {
    id: "user-new-facebook",
    name: "Facebook 試用成員",
    email: "facebook.member@securecart.dev",
    phone: "0952-468-137",
  },
  "bind-LINE": {
    id: "user-new-line",
    name: "LINE 試用成員",
    email: "line.member@securecart.dev",
    phone: "0971-824-653",
  },
};

// ---------------------------------------------------------------------------
// Session Verification
// ---------------------------------------------------------------------------

export const verifySession = cache(async () => {
  const token = await getSession();

  if (!token) {
    redirect("/login");
  }

  return { isAuth: true as const, token };
});

// ---------------------------------------------------------------------------
// User Data
// ---------------------------------------------------------------------------

export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const token = await getSession();

  if (!token) {
    return null;
  }

  // 模擬：從 token 解析出 userId（mock token 格式: "mock-jwt-token-{userId}"）
  const userId = token.replace("mock-jwt-token-", "");
  const user = MOCK_USER_DB[userId] ?? null;

  if (user) return user;

  // Fallback：動態註冊的用戶（userId 不在靜態 mock DB 中）
  // 接後端 API 後，此 fallback 可移除
  if (token.startsWith("mock-jwt-token-")) {
    return {
      id: userId,
      name: "新註冊用戶",
      email: "",
      phone: "",
    };
  }

  return null;
});
