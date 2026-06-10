import type { SubscriptionRecordData } from "@/features/subscriptions/dal/types";

export function getRecordEventLabel(event: SubscriptionRecordData["event"]) {
  const labels: Record<SubscriptionRecordData["event"], string> = {
    renewal: "續訂",
    created: "建立訂閱",
    plan_change: "方案變更",
  };

  return labels[event];
}
