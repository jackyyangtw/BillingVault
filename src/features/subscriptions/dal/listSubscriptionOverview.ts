import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { products } from "@/mocks/fixtures/products";
import { type BillingCycle, plans } from "@/mocks/fixtures/plans";
import type {
  CurrentSubscriptionData,
  PlanOptionData,
  SubscriptionOverview,
  SubscriptionRecordData,
} from "./types";

const subscriptionInclude = {
  order: {
    select: { amountCents: true, status: true },
  },
} satisfies Prisma.SubscriptionInclude;

type SubscriptionRecord = Prisma.SubscriptionGetPayload<{
  include: typeof subscriptionInclude;
}>;

export async function listSubscriptionOverview(
  userId: string,
): Promise<SubscriptionOverview> {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: [{ currentPeriodEnd: "desc" }, { createdAt: "desc" }],
    take: 6,
    include: subscriptionInclude,
  });

  const currentSubscription = getCurrentSubscription(subscriptions);

  return {
    currentSubscription: currentSubscription
      ? toCurrentSubscription(currentSubscription)
      : null,
    planOptions: getPlanOptions(currentSubscription?.planId ?? null),
    subscriptionRecords: subscriptions.map(toSubscriptionRecord),
  };
}

// Subscription selection
function getCurrentSubscription(subscriptions: SubscriptionRecord[]) {
  return (
    subscriptions.find((subscription) => subscription.status !== "canceled") ??
    subscriptions[0] ??
    null
  );
}

// Mappers
function toCurrentSubscription(
  subscription: SubscriptionRecord,
): CurrentSubscriptionData {
  return {
    id: subscription.id,
    planId: subscription.planId,
    planName: getPlanName(subscription.planId),
    productName: getProductName(subscription.productId),
    status: subscription.status,
    cycle: toBillingCycle(subscription.cycle),
    seats: planSeats[subscription.planId] ?? 1,
    renewalDate: subscription.currentPeriodEnd.toISOString(),
    nextInvoiceAmount: centsToAmount(subscription.order.amountCents),
    trialDaysLeft: getTrialDaysLeft(subscription),
  };
}

function toSubscriptionRecord(
  subscription: SubscriptionRecord,
  index: number,
  subscriptions: SubscriptionRecord[],
): SubscriptionRecordData {
  const nextSubscription = subscriptions[index + 1];

  return {
    id: getShortSubscriptionId(subscription.id),
    date: subscription.createdAt.toISOString(),
    amount: centsToAmount(subscription.order.amountCents),
    status: getRecordStatus(subscription.order.status),
    planName: getPlanName(subscription.planId),
    event: getRecordEvent(subscription, nextSubscription),
  };
}

// Plan helpers
const planSeats: Record<string, number> = {
  starter: 1,
  pro: 5,
  business: 25,
  enterprise: 100,
};

function getPlanOptions(currentPlanId: string | null): PlanOptionData[] {
  const currentPlanIndex = currentPlanId
    ? plans.findIndex((plan) => plan.id === currentPlanId)
    : -1;

  return plans.map((plan, index) => ({
    id: plan.id,
    name: plan.name,
    price: getPlanPriceLabel(plan, "monthly"),
    fit: plan.description,
    action: getPlanAction(plan.id, index, currentPlanId, currentPlanIndex),
  }));
}

function getPlanAction(
  planId: string,
  planIndex: number,
  currentPlanId: string | null,
  currentPlanIndex: number,
): PlanOptionData["action"] {
  if (planId === currentPlanId) {
    return "current";
  }

  if (planId === "enterprise") {
    return "contact";
  }

  if (currentPlanIndex === -1 || planIndex > currentPlanIndex) {
    return "upgrade";
  }

  return "downgrade";
}

function getPlanPriceLabel(plan: (typeof plans)[number], cycle: BillingCycle) {
  const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  if (price === null) {
    return "洽詢報價";
  }

  return `$${price}/月`;
}

function getPlanName(planId: string) {
  return plans.find((plan) => plan.id === planId)?.name ?? planId;
}

// Subscription record helpers
function getRecordStatus(
  status: SubscriptionRecord["order"]["status"],
): SubscriptionRecordData["status"] {
  if (status === "paid") {
    return "paid";
  }

  if (status === "failed" || status === "canceled") {
    return "failed";
  }

  return "open";
}

function getRecordEvent(
  subscription: SubscriptionRecord,
  nextSubscription?: SubscriptionRecord,
): SubscriptionRecordData["event"] {
  if (!nextSubscription) {
    return "created";
  }

  if (subscription.planId !== nextSubscription.planId) {
    return "plan_change";
  }

  return "renewal";
}

// Product helpers
function getProductName(productId: string) {
  return (
    products.find((product) => product.id === productId)?.name ?? productId
  );
}

// Date and value formatting helpers
function getTrialDaysLeft(subscription: SubscriptionRecord) {
  if (subscription.status !== "trialing") {
    return 0;
  }

  const diffMs = subscription.currentPeriodEnd.getTime() - Date.now();

  return Math.max(0, Math.ceil(diffMs / 86_400_000));
}

function toBillingCycle(cycle: string): BillingCycle {
  return cycle === "yearly" ? "yearly" : "monthly";
}

function centsToAmount(amountCents: number) {
  return amountCents / 100;
}

function getShortSubscriptionId(id: string) {
  return `SUB-${id.slice(0, 8).toUpperCase()}`;
}
