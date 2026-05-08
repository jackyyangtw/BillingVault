/**
 * 後端 API 抽象層（Mock 實作）
 * 👉 後端API好了之後要拆分成個別檔案
 *
 * 模擬後端登入 API 的回傳結果，
 * 未來替換成真正的 fetch() 呼叫即可，其他模組完全不需要修改。
 *
 * Mock 帳號：demo@securecart.dev / secure-demo-2026
 *
 * @module lib/auth/api
 */
import "server-only";

import type { AuthApiResponse } from "./types";

const MOCK_USERS = [
  {
    id: "user-securecart-demo",
    email: "demo@securecart.dev",
    password: "secure-demo-2026",
    name: "林品安",
    phone: "0918-246-135",
    avatar: undefined,
  },
];

// ---------------------------------------------------------------------------
// API Functions（未來替換成真正的 fetch）
// ---------------------------------------------------------------------------

/**
 * Email 登入
 *
 * TODO: 可替換為真正的後端 API 呼叫
 */
export async function loginAPI(
  email: string,
  password: string,
): Promise<AuthApiResponse> {
  // 模擬網路延遲
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    return { success: false, error: "帳號或密碼錯誤" };
  }

  return {
    success: true,
    token: `mock-jwt-token-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    },
  };
}

/**
 * Email 註冊
 *
 * TODO: 可替換為真正的後端 API 呼叫
 */
export async function registerAPI(
  email: string,
  password: string,
  name: string,
  phone: string,
): Promise<AuthApiResponse> {
  // 模擬網路延遲
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 模擬：檢查 email 是否已被註冊
  const exists = MOCK_USERS.find((u) => u.email === email);
  if (exists) {
    return { success: false, error: "此 Email 已被註冊" };
  }

  // 模擬：建立新用戶
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
  };

  return {
    success: true,
    token: `mock-jwt-token-${newUser.id}`,
    user: newUser,
  };
}

/**
 * 第三方登入
 *
 * TODO: 可替換為真正的 OAuth 流程
 */
export async function thirdPartyLoginAPI(
  provider: string,
  _code?: string,
): Promise<AuthApiResponse> {
  void _code;
  // 模擬網路延遲
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    token: `mock-jwt-token-user-third-party`,
    // 模擬：一律視為新用戶（尚未完成註冊）
    isRegistered: false,
    user: {
      id: "user-third-party",
      name: `${provider} 試用成員`,
      email: `${provider.toLowerCase()}@securecart.dev`,
      phone: "0927-315-864",
    },
  };
}
