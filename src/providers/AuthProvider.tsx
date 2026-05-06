/**
 * AuthProvider
 *
 * Client Component，負責在應用啟動時將 server 端取得的用戶資料
 * 同步到 Zustand store，讓所有 Client Component 能讀取認證狀態。
 *
 * 放在 root layout 中，由 Server Component 傳入 `user` prop。
 */
"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { UserProfile } from "@/lib/auth/types";

interface AuthProviderProps {
  user: UserProfile | null;
  children: React.ReactNode;
}

export default function AuthProvider({ user, children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const initialized = useRef(false);

  useEffect(() => {
    // 只在首次 mount 或 user 改變時同步
    if (!initialized.current || user?.id !== useAuthStore.getState().user?.id) {
      setUser(user);
      initialized.current = true;
    }
  }, [user, setUser]);

  return <>{children}</>;
}
