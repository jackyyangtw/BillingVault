import type {
  SubscriptionRecordData,
  SubscriptionStatus,
} from "@/features/subscriptions/dal/types";
import { formatTwdAmount } from "@/lib/currency";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatCurrency(amount: number) {
  return formatTwdAmount(amount);
}

export function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}

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

export function getRecordStatusLabel(status: SubscriptionRecordData["status"]) {
  const labels: Record<SubscriptionRecordData["status"], string> = {
    paid: "已付款",
    open: "待付款",
    failed: "付款失敗",
  };

  return labels[status];
}

export function getRecordEventLabel(event: SubscriptionRecordData["event"]) {
  const labels: Record<SubscriptionRecordData["event"], string> = {
    renewal: "續訂",
    created: "建立訂閱",
    plan_change: "方案變更",
  };

  return labels[event];
}
