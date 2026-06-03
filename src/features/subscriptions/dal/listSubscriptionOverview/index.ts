import "server-only";

import type { SubscriptionOverview } from "../types";
import { toCurrentSubscription, toSubscriptionRecord } from "./mappers";
import { getPlanOptions } from "./planOptions";
import { listRecentSubscriptions } from "./subscriptionQuery";
import { getCurrentSubscription } from "./subscriptionRules";

export async function listSubscriptionOverview(
  userId: string,
): Promise<SubscriptionOverview> {
  const subscriptions = await listRecentSubscriptions(userId);
  const currentSubscription = getCurrentSubscription(subscriptions);

  return {
    currentSubscription: currentSubscription
      ? toCurrentSubscription(currentSubscription)
      : null,
    planOptions: getPlanOptions(currentSubscription?.planId ?? null),
    subscriptionRecords: subscriptions.map(toSubscriptionRecord),
  };
}
