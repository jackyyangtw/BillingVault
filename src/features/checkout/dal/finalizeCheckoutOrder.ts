import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";
import type { TapPaySandboxPaymentResult } from "@/features/checkout/payments/processTapPaySandboxPayment";
import { prisma } from "@/lib/prisma";
import type { CheckoutPaymentSource } from "./checkoutPaymentSource";
import { getPeriodEnd } from "./checkoutOrderNumbers";
import type { CreateCheckoutOrderInput } from "./createCheckoutOrderTypes";

type CheckoutPricing = ReturnType<typeof calculateCheckoutPricing>;

export async function markCheckoutPaymentFailed({
  pendingOrderId,
  pendingPaymentId,
  paymentResult,
}: {
  pendingOrderId: string;
  pendingPaymentId: string;
  paymentResult: Extract<TapPaySandboxPaymentResult, { status: "failed" }>;
}) {
  await prisma.$transaction([
    prisma.paymentRecord.update({
      where: { id: pendingPaymentId },
      data: {
        status: "failed",
        providerTradeId: paymentResult.providerTradeId,
        providerStatusCode: paymentResult.providerStatusCode,
        providerMessage: paymentResult.providerMessage,
        failureCode: paymentResult.failureCode,
        failureMessage: paymentResult.failureMessage,
      },
    }),
    prisma.order.update({
      where: { id: pendingOrderId },
      data: { status: "failed" },
    }),
  ]);
}

export async function completeCheckoutOrder({
  userId,
  input,
  pendingOrderId,
  pendingPaymentId,
  invoiceNumber,
  pricing,
  paymentSource,
  paymentResult,
}: {
  userId: string;
  input: CreateCheckoutOrderInput;
  pendingOrderId: string;
  pendingPaymentId: string;
  invoiceNumber: string;
  pricing: CheckoutPricing;
  paymentSource: CheckoutPaymentSource;
  paymentResult: Extract<TapPaySandboxPaymentResult, { status: "succeeded" }>;
}) {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.paymentRecord.update({
      where: { id: pendingPaymentId },
      data: {
        status: "succeeded",
        providerTradeId: paymentResult.providerTradeId,
        providerStatusCode: paymentResult.providerStatusCode,
        providerMessage: paymentResult.providerMessage,
      },
    });

    await tx.order.update({
      where: { id: pendingOrderId },
      data: { status: "paid" },
    });

    await tx.invoice.create({
      data: {
        userId,
        orderId: pendingOrderId,
        paymentRecordId: pendingPaymentId,
        invoiceNumber,
        amountCents: pricing.amountCents,
        currency: pricing.currency,
        status: "paid",
      },
    });

    await tx.subscription.create({
      data: {
        userId,
        orderId: pendingOrderId,
        planId: input.planId,
        productId: input.productIds[0],
        cycle: input.cycle,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: getPeriodEnd(now, input.cycle),
        items: {
          create: pricing.productLineItems.map((item) => ({
            productId: item.productId,
          })),
        },
      },
    });

    const newPaymentMethod =
      paymentSource.type === "prime" ? paymentSource.newPaymentMethod : null;

    if (!newPaymentMethod) {
      return;
    }

    const existingCount = await tx.paymentMethod.count({
      where: { userId },
    });

    await tx.paymentMethod.create({
      data: {
        userId,
        ...newPaymentMethod,
        providerCardKey: paymentResult.cardSecret?.cardKey,
        providerCardToken: paymentResult.cardSecret?.cardToken,
        tappayPrimeState: paymentResult.cardSecret
          ? "ready"
          : "requires_refresh",
        isDefault: existingCount === 0,
      },
    });
  });
}
