import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrderData } from "./types";
import {
  formatCurrency,
  formatDate,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "./utils";

type OrderHistoryProps = {
  orders: OrderData[];
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>訂單紀錄</CardTitle>
        <CardDescription>
          最近建立的 sandbox 訂單、方案與付款授權狀態。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {orders.map((order) => (
            <div
              key={order.id}
              className="hover:bg-muted/50 hover:border-primary/40 grid gap-4 rounded-lg border-l-2 border-transparent px-3 py-3 transition-colors md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="max-w-full min-w-0 truncate font-semibold">
                    {order.orderNumber}
                  </p>
                  <Badge
                    variant={
                      order.status === "paid"
                        ? "secondary"
                        : order.status === "failed"
                          ? "destructive"
                          : "outline"
                    }
                    className={getOrderStatusBadgeClassName(order.status)}
                  >
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {order.planName} / {order.productName} ·{" "}
                  {formatDate(order.date)}
                </p>
                {order.providerTradeId && (
                  <p className="text-muted-foreground mt-1 max-w-full truncate text-xs">
                    {order.providerTradeId}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 md:items-end">
                <span className="text-base font-semibold">
                  {formatCurrency(order.amount)}
                </span>
                <span className="text-muted-foreground text-sm">
                  {getPaymentStatusLabel(order.paymentStatus)}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-muted-foreground rounded-3xl border border-dashed p-6 text-sm leading-6">
              目前尚無訂單。完成 checkout 後會在這裡顯示訂單編號與付款狀態。
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getOrderStatusBadgeClassName(status: OrderData["status"]) {
  const classNames: Record<OrderData["status"], string> = {
    paid: "border-emerald-500/30 bg-emerald-500/12 text-emerald-200",
    pending: "border-amber-500/30 bg-amber-500/12 text-amber-200",
    failed: "border-red-500/30 bg-red-500/12 text-red-200",
    canceled: "border-zinc-500/30 bg-zinc-500/12 text-zinc-200",
  };

  return classNames[status];
}
