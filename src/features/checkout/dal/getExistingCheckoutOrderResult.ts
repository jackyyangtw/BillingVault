import { appCurrency } from "@/lib/currency";
import { prisma } from "@/lib/prisma";
import type { CheckoutOrderResult } from "./createCheckoutOrderTypes";

export async function getExistingCheckoutOrderResult(
  userId: string,
  idempotencyKey: string,
): Promise<CheckoutOrderResult | null> {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      idempotencyKey,
    },
    include: {
      payments: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    return null;
  }

  const payment = order.payments[0];

  if (order.status === "pending" || !payment) {
    throw new Error("結帳正在處理中，請稍候再試。");
  }

  if (order.status === "failed" || payment.status === "failed") {
    return {
      status: "failed",
      orderId: order.id,
      orderNumber: order.orderNumber,
      amountCents: order.amountCents,
      currency: appCurrency,
      providerTradeId: payment.providerTradeId ?? "",
      failureMessage: payment.failureMessage ?? undefined,
    };
  }

  return {
    status: "succeeded",
    orderId: order.id,
    orderNumber: order.orderNumber,
    amountCents: order.amountCents,
    currency: appCurrency,
    providerTradeId: payment.providerTradeId ?? "",
  };
}
