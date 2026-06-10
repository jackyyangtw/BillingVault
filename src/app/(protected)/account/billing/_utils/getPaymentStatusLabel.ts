import type { OrderData } from "../_components/types";

export function getPaymentStatusLabel(status: OrderData["paymentStatus"]) {
  const labels: Record<OrderData["paymentStatus"], string> = {
    pending: "等待授權",
    succeeded: "授權成功",
    failed: "授權失敗",
  };

  return labels[status];
}
