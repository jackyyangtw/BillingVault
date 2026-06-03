"use server";

import { redirect } from "next/navigation";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Public logout endpoint: expired sessions should still be redirected home.
// react-doctor-disable-next-line react-doctor/server-auth-actions
export async function logoutAction(): Promise<void> {
  if (getSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
