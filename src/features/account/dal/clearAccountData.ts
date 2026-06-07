import "server-only";

import { prisma } from "@/lib/prisma";

export async function clearAccountData(userId: string): Promise<void> {
  await prisma.$transaction([
    prisma.subscriptionPlanChange.deleteMany({ where: { userId } }),
    prisma.subscriptionItem.deleteMany({
      where: { subscription: { userId } },
    }),
    prisma.subscription.deleteMany({ where: { userId } }),
    prisma.invoice.deleteMany({ where: { userId } }),
    prisma.orderItem.deleteMany({ where: { order: { userId } } }),
    prisma.paymentRecord.deleteMany({ where: { order: { userId } } }),
    prisma.order.deleteMany({ where: { userId } }),
  ]);
}
