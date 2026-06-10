import type { CurrentSubscriptionData, SubscriptionRecordData } from "../types";
import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";
import { getPlanName, getPlanSeats } from "./planOptions";
import { getIsExpiringSoon, getTrialDaysLeft } from "./subscriptionRules";
import type { SubscriptionRecord } from "./subscriptionQuery";
import {
  centsToAmount,
  getProductName,
  getShortSubscriptionId,
  toBillingCycle,
} from "./utils";

export function toCurrentSubscription(
  subscription: SubscriptionRecord,
): CurrentSubscriptionData {
  return {
    id: subscription.id,
    planId: subscription.planId,
    planName: getPlanName(subscription.planId),
    productName: getSubscriptionProductName(subscription),
    status: subscription.status,
    cycle: toBillingCycle(subscription.cycle),
    seats: getPlanSeats(subscription.planId),
    renewalDate: subscription.currentPeriodEnd.toISOString(),
    nextInvoiceAmount: getNextInvoiceAmount(subscription),
    trialDaysLeft: getTrialDaysLeft(subscription),
    isExpiringSoon: getIsExpiringSoon(subscription),
    scheduledChange: toScheduledChange(subscription),
  };
}

export function toSubscriptionRecord(
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
    productName: getSubscriptionProductName(subscription),
    planName: getPlanName(subscription.planId),
    event: getRecordEvent(subscription, nextSubscription),
  };
}

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

function getNextInvoiceAmount(subscription: SubscriptionRecord) {
  return centsToAmount(
    calculateCheckoutPricing({
      planId: subscription.planId,
      productIds: getSubscriptionProductIds(subscription),
      cycle: toBillingCycle(subscription.cycle),
    }).amountCents,
  );
}

function getSubscriptionProductIds(subscription: SubscriptionRecord) {
  const productIds = subscription.items.map((item) => item.productId);

  return productIds.length > 0 ? productIds : [subscription.productId];
}

function getSubscriptionProductName(subscription: SubscriptionRecord) {
  return getSubscriptionProductIds(subscription).map(getProductName).join("、");
}

function toScheduledChange(subscription: SubscriptionRecord) {
  const scheduledChange = subscription.scheduledChanges[0];

  if (!scheduledChange) {
    return null;
  }

  return {
    id: scheduledChange.id,
    fromPlanName: getPlanName(scheduledChange.fromPlanId),
    fromCycle: toBillingCycle(scheduledChange.fromCycle),
    toPlanId: scheduledChange.toPlanId,
    toPlanName: getPlanName(scheduledChange.toPlanId),
    toCycle: toBillingCycle(scheduledChange.toCycle),
    effectiveAt: scheduledChange.effectiveAt.toISOString(),
  };
}
