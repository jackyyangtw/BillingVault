import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const subscriptionInclude = {
  order: {
    select: { amountCents: true, status: true },
  },
  scheduledChanges: {
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    take: 1,
  },
  items: true,
} satisfies Prisma.SubscriptionInclude;

export type SubscriptionRecord = Prisma.SubscriptionGetPayload<{
  include: typeof subscriptionInclude;
}>;

export async function listRecentSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: [{ currentPeriodEnd: "desc" }, { createdAt: "desc" }],
    take: 6,
    include: subscriptionInclude,
  });
}
