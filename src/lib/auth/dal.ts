/**
 * Data Access Layer (DAL)
 *
 * 給 Server Component 使用的驗證層。
 * 使用 React `cache` 避免同一次 render 中重複讀取 cookie。
 *
 * Supabase Auth 會在 server 端驗證使用者，Client Component 只接收
 * 非敏感的 UserProfile。
 *
 * @module lib/auth/dal
 */
import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserProfile } from "./types";

type SupabaseUserMetadata = {
  name?: string;
  full_name?: string;
  avatar_url?: string;
  picture?: string;
  phone?: string;
};

function getDisplayName(email: string, metadata: SupabaseUserMetadata): string {
  return metadata.name ?? metadata.full_name ?? email.split("@")[0] ?? "User";
}

function toUserProfile(user: {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: SupabaseUserMetadata;
}): UserProfile {
  const email = user.email ?? "";
  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    name: getDisplayName(email, metadata),
    email,
    phone: user.phone ?? metadata.phone,
    avatar: metadata.avatar_url ?? metadata.picture,
  };
}

// ---------------------------------------------------------------------------
// Session Verification
// ---------------------------------------------------------------------------

export const verifySession = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return { isAuth: true as const, userId: user.id, user };
});

// ---------------------------------------------------------------------------
// User Data
// ---------------------------------------------------------------------------

export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  if (!getSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return toUserProfile(user);
});
