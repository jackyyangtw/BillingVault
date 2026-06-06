import { formatTwdAmount } from "@/lib/currency";
import type { InvoiceData, OrderData } from "./types";

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

export function getInvoiceStatusLabel(status: InvoiceData["status"]) {
  const labels: Record<InvoiceData["status"], string> = {
    paid: "已付款",
    open: "待付款",
    failed: "付款失敗",
  };

  return labels[status];
}

export function getOrderStatusLabel(status: OrderData["status"]) {
  const labels: Record<OrderData["status"], string> = {
    pending: "處理中",
    paid: "已付款",
    failed: "付款失敗",
    canceled: "已取消",
  };

  return labels[status];
}

export function getPaymentStatusLabel(status: OrderData["paymentStatus"]) {
  const labels: Record<OrderData["paymentStatus"], string> = {
    pending: "等待授權",
    succeeded: "授權成功",
    failed: "授權失敗",
  };

  return labels[status];
}
