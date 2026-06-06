import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";
import { prisma } from "@/lib/prisma";
import type { CheckoutPaymentSource } from "./checkoutPaymentSource";
import type { CreateCheckoutOrderInput } from "./createCheckoutOrderTypes";
import { getExistingCheckoutOrderResult } from "./getExistingCheckoutOrderResult";

type CheckoutPricing = ReturnType<typeof calculateCheckoutPricing>;

export async function assertNoRecentPendingOrder(userId: string) {
  const recentPendingOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: "pending",
      createdAt: { gte: new Date(Date.now() - 30_000) },
    },
    select: { id: true },
  });

  if (recentPendingOrder) {
    throw new Error("結帳正在處理中，請稍候再試。");
  }
}

export async function createPendingCheckoutOrder({
  userId,
  input,
  orderNumber,
  pricing,
  paymentSource,
}: {
  userId: string;
  input: CreateCheckoutOrderInput;
  orderNumber: string;
  pricing: CheckoutPricing;
  paymentSource: CheckoutPaymentSource;
}) {
  try {
    return await prisma.order.create({
      data: {
        userId,
        orderNumber,
        idempotencyKey: input.idempotencyKey,
        planId: input.planId,
        productId: input.productId,
        cycle: input.cycle,
        companyName: input.companyName,
        billingEmail: input.billingEmail,
        taxId: input.taxId || undefined,
        billingAddress: input.billingAddress,
        amountCents: pricing.amountCents,
        currency: pricing.currency,
        payments: {
          create: {
            orderNumber,
            amountCents: pricing.amountCents,
            currency: pricing.currency,
            cardIdentifier: paymentSource.cardIdentifier,
            cardLast4: paymentSource.last4,
          },
        },
      },
      include: {
        payments: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const existingOrder = await getExistingCheckoutOrderResult(
      userId,
      input.idempotencyKey,
    );

    if (existingOrder) {
      throw new Error("結帳正在處理中，請稍候再試。");
    }

    throw error;
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
