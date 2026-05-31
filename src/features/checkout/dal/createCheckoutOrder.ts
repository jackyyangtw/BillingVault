import "server-only";

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";
import { processTapPaySandboxPayment } from "@/features/checkout/payments/processTapPaySandboxPayment";
import { getTapPayCardBrand } from "@/features/payment-methods/cardBrand";
import type { BillingCycle } from "@/mocks/fixtures/plans";

type CreateCheckoutOrderInput = {
  planId: string;
  productId: string;
  cycle: BillingCycle;
  companyName: string;
  billingEmail: string;
  taxId?: string;
  billingAddress: string;
  prime?: string;
  paymentMethodId?: string;
  card?: {
    binCode?: string;
    last4?: string;
    type?: number;
    issuer?: string;
    issuerZhTw?: string;
    cardIdentifier?: string;
    expMonth?: number;
    expYear?: number;
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
  const paymentSource = await getCheckoutPaymentSource(userId, input);

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
  const pendingPayment = pending.payments[0];

  if (!pendingPayment) {
    throw new Error("付款紀錄建立失敗。");
  }

  const paymentResult = await processTapPaySandboxPayment({
    orderNumber,
    amountCents: pricing.amountCents,
    prime: paymentSource.prime,
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

  await prisma.$transaction(async (tx) => {
    await tx.paymentRecord.update({
      where: { id: pendingPayment.id },
      data: {
        status: "succeeded",
        providerTradeId: paymentResult.providerTradeId,
        providerStatusCode: paymentResult.providerStatusCode,
        providerMessage: paymentResult.providerMessage,
      },
    });

    await tx.order.update({
      where: { id: pending.id },
      data: { status: "paid" },
    });

    await tx.invoice.create({
      data: {
        userId,
        orderId: pending.id,
        paymentRecordId: pendingPayment.id,
        invoiceNumber,
        amountCents: pricing.amountCents,
        currency: pricing.currency,
        status: "paid",
      },
    });

    await tx.subscription.create({
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
    });

    if (paymentSource.newPaymentMethod) {
      const existingCount = await tx.paymentMethod.count({
        where: { userId },
      });

      await tx.paymentMethod.create({
        data: {
          userId,
          ...paymentSource.newPaymentMethod,
          isDefault: existingCount === 0,
        },
      });
    }
  });

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

async function getCheckoutPaymentSource(
  userId: string,
  input: CreateCheckoutOrderInput,
) {
  if (input.paymentMethodId) {
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: input.paymentMethodId,
        userId,
      },
    });

    if (!paymentMethod) {
      throw new Error("找不到可用的付款方式。");
    }

    if (paymentMethod.tappayPrimeState !== "ready") {
      throw new Error("此付款方式需要重新綁定後才能使用。");
    }

    if (isExpiredPaymentMethod(paymentMethod)) {
      throw new Error("此付款方式已過期，請選擇其他卡片。");
    }

    return {
      prime: `saved_${paymentMethod.id}`,
      cardIdentifier: paymentMethod.cardIdentifier ?? undefined,
      last4: paymentMethod.last4,
    };
  }

  if (!input.prime) {
    throw new Error("請選擇付款方式或輸入信用卡資料。");
  }

  return {
    prime: input.prime,
    cardIdentifier: input.card?.cardIdentifier,
    last4: input.card?.last4,
    newPaymentMethod: input.card
      ? {
          brand: getTapPayCardBrand(input.card) ?? "Card",
          binCode: input.card.binCode,
          last4: input.card.last4 ?? "0000",
          holder: input.companyName,
          billingEmail: input.billingEmail,
          cardIdentifier: input.card.cardIdentifier,
          expMonth: input.card.expMonth,
          expYear: input.card.expYear,
        }
      : undefined,
  };
}

function isExpiredPaymentMethod(method: {
  expMonth: number | null;
  expYear: number | null;
}) {
  if (!method.expMonth || !method.expYear) {
    return false;
  }

  const expiresAt = new Date(method.expYear, method.expMonth, 0, 23, 59, 59);

  return expiresAt < new Date();
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
