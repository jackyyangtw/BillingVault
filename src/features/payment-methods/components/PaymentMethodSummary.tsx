import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import { cn } from "@/lib/tailwind-css/utils";
import PaymentCardBrandMark from "./PaymentCardBrandMark";
import {
  paymentMethodStatusLabel,
  tappayStateLabel,
} from "./paymentMethodLabels";

type PaymentMethodSummaryProps = {
  method: PaymentMethod;
  actions?: ReactNode;
  highlightPrimary?: boolean;
  isSelected?: boolean;
};

export default function PaymentMethodSummary({
  method,
  actions,
  highlightPrimary = true,
  isSelected = false,
}: PaymentMethodSummaryProps) {
  const isPrimary = method.status === "primary";
  const isHighlighted = isSelected || (highlightPrimary && isPrimary);
  const cardNumberLabel = method.binCode
    ? `${method.binCode} .... ${method.last4}`
    : `ending in ${method.last4}`;

  return (
    <div
      className={cn(
        "grid gap-4 rounded-3xl border p-4 text-left md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center",
        isHighlighted &&
          "border-primary/30 bg-primary/3 ring-primary/10 dark:border-primary/25 dark:bg-primary/8 dark:ring-primary/10 ring-1",
      )}
    >
      <PaymentCardBrandMark brand={method.brand} isPrimary={isHighlighted} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">
            {method.brand} {cardNumberLabel}
          </p>
          <Badge
            variant={method.status === "expired" ? "outline" : "secondary"}
          >
            {paymentMethodStatusLabel[method.status]}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {method.holder} · Expires {method.expiresAt}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {method.billingEmail} · {tappayStateLabel[method.tappayPrimeState]}
        </p>
      </div>
      {actions && <div className="flex gap-2 md:justify-end">{actions}</div>}
    </div>
  );
}
