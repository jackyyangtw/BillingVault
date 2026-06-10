import type { OrderData } from "../_components/types";

export function getOrderStatusLabel(status: OrderData["status"]) {
  const labels: Record<OrderData["status"], string> = {
    pending: "處理中",
    paid: "已付款",
    failed: "付款失敗",
    canceled: "已取消",
  };

  return labels[status];
}
