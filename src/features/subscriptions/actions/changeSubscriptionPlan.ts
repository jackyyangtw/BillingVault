"use server";

import { refresh } from "next/cache";
import { z } from "zod/v4";
import { changeSubscriptionPlan } from "@/features/subscriptions/dal/changeSubscriptionPlan";
import { verifySession } from "@/lib/auth/dal";
import { plans } from "@/mocks/plans";

const planIds = plans.map((plan) => plan.id);

const changeSubscriptionPlanSchema = z.object({
  subscriptionId: z.string().uuid(),
  planId: z.string().refine((value) => planIds.includes(value), {
    message: "請選擇有效的訂閱方案。",
  }),
  cycle: z.enum(["monthly", "yearly"]),
});

export type ChangeSubscriptionPlanInput = z.infer<
  typeof changeSubscriptionPlanSchema
>;

export async function changeSubscriptionPlanAction(
  input: ChangeSubscriptionPlanInput,
) {
  const { userId } = await verifySession();
  const parsed = changeSubscriptionPlanSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("訂閱方案資料無效。");
  }

  const result = await changeSubscriptionPlan(userId, parsed.data);
  refresh();

  return {
    message:
      result.changeType === "upgrade"
        ? "Subscription plan has been upgraded."
        : "Subscription downgrade has been scheduled.",
    changeType: result.changeType,
  };
}
