import type { CurrentSubscriptionData, SubscriptionRecordData } from "../types";
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
    productName: getProductName(subscription.productId),
    status: subscription.status,
    cycle: toBillingCycle(subscription.cycle),
    seats: getPlanSeats(subscription.planId),
    renewalDate: subscription.currentPeriodEnd.toISOString(),
    nextInvoiceAmount: centsToAmount(subscription.order.amountCents),
    trialDaysLeft: getTrialDaysLeft(subscription),
    isExpiringSoon: getIsExpiringSoon(subscription),
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
