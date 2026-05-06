/**
 * Auth Zustand Store
 *
 * Client 端的認證狀態管理，存放非敏感的用戶資料供 UI 渲染使用。
 * 例如 Navbar、個人面板等 Client Component 讀取此 store 決定顯示內容。
 *
 * 注意：安全驗證不依賴此 store，而是透過 cookie + DAL 在 server 端進行。
 *
 * @module stores/auth-store
 */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { UserProfile } from "@/lib/auth/types";
import { isDevelopment } from "@/lib/env";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthState {
  /** 當前登入用戶的 profile（null = 未登入） */
  user: UserProfile | null;
  /** 是否已登入（derived from user） */
  isAuthenticated: boolean;
}

interface AuthActions {
  /** 設定用戶資料（登入成功後呼叫） */
  setUser: (user: UserProfile | null) => void;
  /** 清除用戶資料（登出後呼叫） */
  clearUser: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: user !== null }, undefined, "setUser"),

      clearUser: () =>
        set({ user: null, isAuthenticated: false }, undefined, "clearUser"),
    }),
    { name: "AuthStore", enabled: isDevelopment },
  ),
);
