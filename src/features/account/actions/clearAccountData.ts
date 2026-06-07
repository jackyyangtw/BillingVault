"use server";

import { refresh } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { clearAccountData } from "@/features/account/dal/clearAccountData";

export async function clearAccountDataAction(): Promise<void> {
  const { userId } = await verifySession();
  await clearAccountData(userId);
  refresh();
}
