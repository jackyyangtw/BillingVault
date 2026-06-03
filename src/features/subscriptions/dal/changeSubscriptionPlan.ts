import "server-only";

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";
import { getPlanById, type BillingCycle } from "@/mocks/fixtures/plans";

type ChangeSubscriptionPlanInput = {
  subscriptionId: string;
  planId: string;
};

const changeableStatuses = ["active", "trialing", "past_due"] as const;

type ChangePlanResult = {
  changeType: "upgrade" | "downgrade";
};

export async function changeSubscriptionPlan(
  userId: string,
  input: ChangeSubscriptionPlanInput,
): Promise<ChangePlanResult> {
  const targetPlan = getPlanById(input.planId);

  if (!targetPlan) {
    throw new Error("找不到目標方案。");
  }

  if (targetPlan.monthlyPrice === null || targetPlan.yearlyPrice === null) {
    throw new Error("企業方案需聯繫業務，無法直接變更。");
  }

  const currentSubscription = await prisma.subscription.findFirst({
    where: {
      id: input.subscriptionId,
      userId,
      status: { in: [...changeableStatuses] },
      currentPeriodEnd: { gte: new Date() },
    },
    include: {
      order: {
        select: {
          companyName: true,
          billingEmail: true,
          billingAddress: true,
          taxId: true,
          productId: true,
        },
      },
    },
  });

  if (!currentSubscription) {
    throw new Error("找不到可變更的訂閱。");
  }

  if (currentSubscription.planId === input.planId) {
    throw new Error("目標方案與目前方案相同。");
  }

  const cycle = currentSubscription.cycle as BillingCycle;
  const currentPlanAmountCents = calculateCheckoutPricing({
    planId: currentSubscription.planId,
    productId: currentSubscription.productId,
    cycle,
  }).amountCents;
  const targetPlanAmountCents = calculateCheckoutPricing({
    planId: input.planId,
    productId: currentSubscription.productId,
    cycle,
  }).amountCents;
  const changeType =
    targetPlanAmountCents > currentPlanAmountCents ? "upgrade" : "downgrade";

  if (changeType === "downgrade") {
    await scheduleDowngrade({
      userId,
      subscriptionId: currentSubscription.id,
      fromPlanId: currentSubscription.planId,
      toPlanId: input.planId,
      effectiveAt: currentSubscription.currentPeriodEnd,
    });

    return { changeType };
  }

  const proratedAmountCents = calculateProratedUpgradeAmountCents({
    currentAmountCents: currentPlanAmountCents,
    targetAmountCents: targetPlanAmountCents,
    periodStart: currentSubscription.currentPeriodStart,
    periodEnd: currentSubscription.currentPeriodEnd,
  });
  const orderNumber = createOrderNumber();
  const invoiceNumber = createInvoiceNumber(orderNumber);
  const now = new Date();
  const defaultPaymentMethod = await prisma.paymentMethod.findFirst({
    where: { userId, isDefault: true },
    select: { cardIdentifier: true, last4: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { id: currentSubscription.id },
      data: { status: "canceled" },
    });

    const order = await tx.order.create({
      data: {
        userId,
        orderNumber,
        planId: input.planId,
        productId: currentSubscription.productId,
        cycle,
        companyName: currentSubscription.order.companyName,
        billingEmail: currentSubscription.order.billingEmail,
        taxId: currentSubscription.order.taxId ?? undefined,
        billingAddress: currentSubscription.order.billingAddress,
        amountCents: proratedAmountCents,
        currency: "USD",
        status: "paid",
        payments: {
          create: {
            orderNumber,
            amountCents: proratedAmountCents,
            currency: "USD",
            status: "succeeded",
            providerTradeId: createProviderTradeId(orderNumber),
            providerStatusCode: "0",
            providerMessage: "Subscription upgraded in demo mode.",
            cardIdentifier: defaultPaymentMethod?.cardIdentifier,
            cardLast4: defaultPaymentMethod?.last4,
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
    const payment = order.payments[0];

    if (!payment) {
      throw new Error("付款紀錄建立失敗。");
    }

    await tx.invoice.create({
      data: {
        userId,
        orderId: order.id,
        paymentRecordId: payment.id,
        invoiceNumber,
        amountCents: proratedAmountCents,
        currency: "USD",
        status: "paid",
      },
    });

    await tx.subscription.create({
      data: {
        userId,
        orderId: order.id,
        planId: input.planId,
        productId: currentSubscription.productId,
        cycle,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: currentSubscription.currentPeriodEnd,
      },
    });

    await tx.subscriptionPlanChange.updateMany({
      where: {
        subscriptionId: currentSubscription.id,
        status: "pending",
      },
      data: { status: "canceled" },
    });
  });

  return { changeType };
}

function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();

  return `SC${date}${suffix}`;
}

function createInvoiceNumber(orderNumber: string) {
  return `INV-${orderNumber}`;
}

function createProviderTradeId(orderNumber: string) {
  return `DEMO-${orderNumber}`;
}

async function scheduleDowngrade({
  userId,
  subscriptionId,
  fromPlanId,
  toPlanId,
  effectiveAt,
}: {
  userId: string;
  subscriptionId: string;
  fromPlanId: string;
  toPlanId: string;
  effectiveAt: Date;
}) {
  await prisma.$transaction(async (tx) => {
    await tx.subscriptionPlanChange.updateMany({
      where: {
        subscriptionId,
        status: "pending",
      },
      data: { status: "canceled" },
    });

    await tx.subscriptionPlanChange.create({
      data: {
        userId,
        subscriptionId,
        fromPlanId,
        toPlanId,
        effectiveAt,
        status: "pending",
      },
    });
  });
}

function calculateProratedUpgradeAmountCents({
  currentAmountCents,
  targetAmountCents,
  periodStart,
  periodEnd,
}: {
  currentAmountCents: number;
  targetAmountCents: number;
  periodStart: Date;
  periodEnd: Date;
}) {
  const now = new Date();
  const totalMs = Math.max(1, periodEnd.getTime() - periodStart.getTime());
  const remainingMs = Math.max(0, periodEnd.getTime() - now.getTime());
  const remainingRatio = remainingMs / totalMs;
  const amountCents = Math.round(
    (targetAmountCents - currentAmountCents) * remainingRatio,
  );

  return Math.max(0, amountCents);
}
