import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
        <div className="flex flex-col">
          {orders.map((order, index) => (
            <div key={order.id}>
              <div className="grid gap-4 py-4 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="max-w-full min-w-0 truncate font-medium">
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
                <div className="flex flex-col gap-2 md:items-end">
                  <span className="font-medium">
                    {formatCurrency(order.amount)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>
              </div>
              {index < orders.length - 1 && <Separator />}
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
