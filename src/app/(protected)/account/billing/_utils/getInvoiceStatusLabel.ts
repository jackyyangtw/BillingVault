import type { InvoiceData } from "../_components/types";

export function getInvoiceStatusLabel(status: InvoiceData["status"]) {
  const labels: Record<InvoiceData["status"], string> = {
    paid: "已付款",
    open: "待付款",
    failed: "付款失敗",
  };

  return labels[status];
}
