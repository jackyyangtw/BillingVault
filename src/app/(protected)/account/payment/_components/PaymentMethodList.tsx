import type { ComponentType, SVGProps } from "react";
import {
  AmericanExpressFlatRoundedIcon,
  GenericFlatRoundedIcon,
  JCBFlatRoundedIcon,
  MastercardFlatRoundedIcon,
  UnionPayFlatRoundedIcon,
  VisaFlatRoundedIcon,
} from "react-svg-credit-card-payment-icons";
import { Badge } from "@/components/ui/badge";
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
} from "@/lib/payment-methods/types";
import { cn } from "@/lib/tailwind-css/utils";
import PaymentMethodActions from "./PaymentMethodActions";
import PaymentMethodDefaultButton from "./PaymentMethodDefaultButton";

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

type PaymentCardIcon = ComponentType<SVGProps<SVGSVGElement>>;

const cardBrandIcon: Record<string, PaymentCardIcon> = {
  americanexpress: AmericanExpressFlatRoundedIcon,
  amex: AmericanExpressFlatRoundedIcon,
  jcb: JCBFlatRoundedIcon,
  mastercard: MastercardFlatRoundedIcon,
  unionpay: UnionPayFlatRoundedIcon,
  visa: VisaFlatRoundedIcon,
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
        {paymentMethods.length > 0 ? (
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodItem key={method.id} method={method} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground rounded-3xl border border-dashed p-6 text-sm leading-6">
            目前沒有卡片
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type PaymentMethodItemProps = {
  method: PaymentMethod;
};

function PaymentMethodItem({ method }: PaymentMethodItemProps) {
  const isPrimary = method.status === "primary";
  const cardNumberLabel = method.binCode
    ? `${method.binCode} .... ${method.last4}`
    : `ending in ${method.last4}`;

  return (
    <div
      className={cn(
        "grid gap-4 rounded-3xl border p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center",
        isPrimary &&
          "border-primary/30 bg-primary/3 ring-primary/10 dark:border-primary/25 dark:bg-primary/8 dark:ring-primary/10 ring-1",
      )}
    >
      <PaymentCardBrandMark brand={method.brand} isPrimary={isPrimary} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">
            {method.brand} {cardNumberLabel}
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
          <PaymentMethodDefaultButton
            id={method.id}
            disabled={method.status === "expired"}
          />
        )}
        {!isPrimary && <PaymentMethodActions method={method} />}
      </div>
    </div>
  );
}

type PaymentCardBrandMarkProps = {
  brand: string;
  isPrimary: boolean;
};

function PaymentCardBrandMark({ brand, isPrimary }: PaymentCardBrandMarkProps) {
  const normalizedBrand = brand.toLowerCase().replace(/[\s_-]/g, "");
  const CardIcon = cardBrandIcon[normalizedBrand] ?? GenericFlatRoundedIcon;

  return (
    <div
      className={cn(
        "bg-card/80 ring-foreground/10 dark:bg-foreground/5 dark:ring-foreground/10 flex size-16 items-center justify-center rounded-2xl shadow-sm ring-1",
        isPrimary && "ring-primary/15 dark:ring-primary/15",
      )}
      aria-label={`${brand} card`}
      title={brand}
    >
      <CardIcon className="h-auto w-12" />
    </div>
  );
}
