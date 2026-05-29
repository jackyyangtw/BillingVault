import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import { cn } from "@/lib/tailwind-css/utils";
import PaymentMethodActions from "../PaymentMethodActions";
import PaymentMethodDefaultButton from "../PaymentMethodDefaultButton";
import PaymentCardBrandMark from "./PaymentCardBrandMark";
import { statusLabel, tappayStateLabel } from "./constants";

type PaymentMethodItemProps = {
  method: PaymentMethod;
};

export default function PaymentMethodItem({ method }: PaymentMethodItemProps) {
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
