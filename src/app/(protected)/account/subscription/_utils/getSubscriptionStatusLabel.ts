import type { SubscriptionStatus } from "@/features/subscriptions/dal/types";

export function getSubscriptionStatusLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    trialing: "試用中",
    active: "訂閱中",
    past_due: "付款逾期",
    canceled: "已取消續訂",
    incomplete: "尚未完成",
  };

  return labels[status];
}
