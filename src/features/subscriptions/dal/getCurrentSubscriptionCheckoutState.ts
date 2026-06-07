import "server-only";

import { prisma } from "@/lib/prisma";
import type { BillingCycle } from "@/mocks/fixtures/plans";

const currentSubscriptionStatuses = [
  "active",
  "trialing",
  "past_due",
  "canceled",
] as const;

export type CurrentSubscriptionCheckoutState = {
  planId: string;
  cycle: BillingCycle;
};

export async function getCurrentSubscriptionCheckoutState(
  userId: string,
): Promise<CurrentSubscriptionCheckoutState | null> {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      status: { in: [...currentSubscriptionStatuses] },
      currentPeriodEnd: { gte: new Date() },
    },
    orderBy: [{ currentPeriodEnd: "desc" }, { createdAt: "desc" }],
    take: 6,
    select: {
      planId: true,
      cycle: true,
      status: true,
    },
  });
  const currentSubscription =
    subscriptions.find((subscription) => subscription.status !== "canceled") ??
    subscriptions[0] ??
    null;

  if (!currentSubscription) {
    return null;
  }

  return {
    planId: currentSubscription.planId,
    cycle: currentSubscription.cycle === "yearly" ? "yearly" : "monthly",
  };
}
