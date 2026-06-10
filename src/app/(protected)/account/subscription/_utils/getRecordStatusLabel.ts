import type { SubscriptionRecordData } from "@/features/subscriptions/dal/types";

export function getRecordStatusLabel(status: SubscriptionRecordData["status"]) {
  const labels: Record<SubscriptionRecordData["status"], string> = {
    paid: "已付款",
    open: "待付款",
    failed: "付款失敗",
  };

  return labels[status];
}
