import "server-only";

import { prisma } from "@/lib/prisma";

export async function cancelSubscription(
  userId: string,
  subscriptionId: string,
) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      userId,
      status: {
        not: "canceled",
      },
    },
    select: { id: true },
  });

  if (!subscription) {
    throw new Error("找不到可取消的訂閱，或訂閱已經取消。");
  }

  const result = await prisma.subscription.updateMany({
    where: {
      userId,
      status: {
        not: "canceled",
      },
    },
    data: {
      status: "canceled",
    },
  });

  if (result.count === 0) {
    throw new Error("找不到可取消的訂閱，或訂閱已經取消。");
  }
}
