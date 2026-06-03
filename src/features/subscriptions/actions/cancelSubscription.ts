"use server";

import { refresh } from "next/cache";
import { z } from "zod/v4";
import { verifySession } from "@/lib/auth/dal";
import { cancelSubscription } from "@/features/subscriptions/dal/cancelSubscription";

const cancelSubscriptionSchema = z.object({
  id: z.string().uuid(),
});

export async function cancelSubscriptionAction(input: { id: string }) {
  const { userId } = await verifySession();
  const parsed = cancelSubscriptionSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("訂閱資料無效。");
  }

  await cancelSubscription(userId, parsed.data.id);
  refresh();

  return { message: "Subscription has been canceled." };
}
