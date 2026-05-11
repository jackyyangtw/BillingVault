import { CreditCard, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  PaymentMethod,
  PaymentMethodStatus,
} from "@/mocks/fixtures/payment-methods";

type PaymentMethodListProps = {
  paymentMethods: PaymentMethod[];
};

const statusLabel: Record<PaymentMethodStatus, string> = {
  primary: "預設扣款",
  backup: "備援卡",
  expired: "已過期",
};

const tappayStateLabel: Record<PaymentMethod["tappayPrimeState"], string> = {
  ready: "TapPay prime 可用",
  requires_refresh: "需要重新綁定",
  unavailable: "尚未啟用",
};

export default function PaymentMethodList({
  paymentMethods,
}: PaymentMethodListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>已綁定卡片</CardTitle>
        <CardDescription>
          支援多卡管理，保留預設卡、備援卡與過期狀態。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <PaymentMethodItem key={method.id} method={method} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type PaymentMethodItemProps = {
  method: PaymentMethod;
};

function PaymentMethodItem({ method }: PaymentMethodItemProps) {
  return (
    <div className="grid gap-4 rounded-3xl border p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
      <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
        <CreditCard />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">
            {method.brand} ending in {method.last4}
          </p>
          <Badge
            variant={method.status === "expired" ? "outline" : "secondary"}
          >
            {statusLabel[method.status]}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {method.holder} · Expires {method.expiresAt}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {method.billingEmail} · {tappayStateLabel[method.tappayPrimeState]}
        </p>
      </div>
      <div className="flex gap-2 md:justify-end">
        {method.status !== "primary" && (
          <Button
            variant="outline"
            size="sm"
            disabled={method.status === "expired"}
          >
            設為預設
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" aria-label="卡片操作">
          <MoreHorizontal />
        </Button>
      </div>
    </div>
  );
}
