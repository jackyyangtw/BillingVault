import type { InvoiceData } from "./types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
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
