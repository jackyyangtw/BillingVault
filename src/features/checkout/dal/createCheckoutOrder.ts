import "server-only";

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";
import { processTapPaySandboxPayment } from "@/features/checkout/payments/processTapPaySandboxPayment";
import type { BillingCycle } from "@/mocks/fixtures/plans";

type CreateCheckoutOrderInput = {
  planId: string;
  productId: string;
  cycle: BillingCycle;
  companyName: string;
  billingEmail: string;
  taxId?: string;
  billingAddress: string;
  prime: string;
  card?: {
    last4?: string;
    cardIdentifier?: string;
  };
  simulatePaymentFailure?: boolean;
};

export type CheckoutOrderResult = {
  status: "succeeded" | "failed";
  orderId: string;
  orderNumber: string;
  amountCents: number;
  currency: "USD";
  providerTradeId: string;
  failureMessage?: string;
};

export async function createCheckoutOrder(
  userId: string,
  input: CreateCheckoutOrderInput,
): Promise<CheckoutOrderResult> {
  if (process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE !== "sandbox") {
    throw new Error("TapPay sandbox mode is required for demo checkout.");
  }

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

  const pricing = calculateCheckoutPricing(input);
  const orderNumber = createOrderNumber();
  const invoiceNumber = createInvoiceNumber(orderNumber);
  const now = new Date();

  const pending = await prisma.order.create({
    data: {
      userId,
      orderNumber,
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
          cardIdentifier: input.card?.cardIdentifier,
          cardLast4: input.card?.last4,
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
  const pendingPayment = pending.payments[0];

  if (!pendingPayment) {
    throw new Error("付款紀錄建立失敗。");
  }

  const paymentResult = await processTapPaySandboxPayment({
    orderNumber,
    amountCents: pricing.amountCents,
    prime: input.prime,
    simulateFailure: input.simulatePaymentFailure,
  });

  if (paymentResult.status === "failed") {
    await prisma.$transaction([
      prisma.paymentRecord.update({
        where: { id: pendingPayment.id },
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
        where: { id: pending.id },
        data: { status: "failed" },
      }),
    ]);

    return {
      status: "failed",
      orderId: pending.id,
      orderNumber,
      amountCents: pricing.amountCents,
      currency: pricing.currency,
      providerTradeId: paymentResult.providerTradeId,
      failureMessage: paymentResult.failureMessage,
    };
  }

  await prisma.$transaction([
    prisma.paymentRecord.update({
      where: { id: pendingPayment.id },
      data: {
        status: "succeeded",
        providerTradeId: paymentResult.providerTradeId,
        providerStatusCode: paymentResult.providerStatusCode,
        providerMessage: paymentResult.providerMessage,
      },
    }),

    prisma.order.update({
      where: { id: pending.id },
      data: { status: "paid" },
    }),

    prisma.invoice.create({
      data: {
        userId,
        orderId: pending.id,
        paymentRecordId: pendingPayment.id,
        invoiceNumber,
        amountCents: pricing.amountCents,
        currency: pricing.currency,
        status: "paid",
      },
    }),

    prisma.subscription.create({
      data: {
        userId,
        orderId: pending.id,
        planId: input.planId,
        productId: input.productId,
        cycle: input.cycle,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: getPeriodEnd(now, input.cycle),
      },
    }),
  ]);

  return {
    status: "succeeded",
    orderId: pending.id,
    orderNumber,
    amountCents: pricing.amountCents,
    currency: pricing.currency,
    providerTradeId: paymentResult.providerTradeId,
  };
}

function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();

  return `SC${date}${suffix}`;
}

function createInvoiceNumber(orderNumber: string) {
  return `INV-${orderNumber}`;
}

function getPeriodEnd(start: Date, cycle: BillingCycle) {
  const end = new Date(start);

  if (cycle === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }

  return end;
}
