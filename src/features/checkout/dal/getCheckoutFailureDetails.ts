import "server-only";

import { prisma } from "@/lib/prisma";

export type CheckoutFailureDetails = {
  providerStatusCode?: string;
  providerMessage?: string;
  failureCode?: string;
  failureMessage?: string;
};

export async function getCheckoutFailureDetails(
  userId: string,
  orderNumber: string,
): Promise<CheckoutFailureDetails | null> {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      orderNumber,
    },
    select: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          providerStatusCode: true,
          providerMessage: true,
          failureCode: true,
          failureMessage: true,
        },
      },
    },
  });

  const payment = order?.payments[0];

  if (!payment) {
    return null;
  }

  return {
    providerStatusCode: payment.providerStatusCode ?? undefined,
    providerMessage: payment.providerMessage ?? undefined,
    failureCode: payment.failureCode ?? undefined,
    failureMessage: payment.failureMessage ?? undefined,
  };
}
