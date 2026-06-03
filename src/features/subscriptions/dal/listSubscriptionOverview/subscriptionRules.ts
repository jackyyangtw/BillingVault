import type { SubscriptionRecord } from "./subscriptionQuery";

const expiringSoonThresholdMs = 7 * 24 * 60 * 60 * 1000;

export function getCurrentSubscription(subscriptions: SubscriptionRecord[]) {
  const now = new Date();
  const validSubscriptions = subscriptions.filter(
    (subscription) => subscription.currentPeriodEnd >= now,
  );

  return (
    validSubscriptions.find(
      (subscription) => subscription.status !== "canceled",
    ) ??
    validSubscriptions[0] ??
    null
  );
}

export function getTrialDaysLeft(subscription: SubscriptionRecord) {
  if (subscription.status !== "trialing") {
    return 0;
  }

  const diffMs = subscription.currentPeriodEnd.getTime() - Date.now();

  return Math.max(0, Math.ceil(diffMs / 86_400_000));
}

export function getIsExpiringSoon(subscription: SubscriptionRecord) {
  if (subscription.status === "canceled") {
    return false;
  }

  const diffMs = subscription.currentPeriodEnd.getTime() - Date.now();

  return diffMs >= 0 && diffMs <= expiringSoonThresholdMs;
}
