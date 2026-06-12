"use client";

import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import PaymentMethodSummary from "@/features/payment-methods/components/PaymentMethodSummary";
import type { CheckoutPaymentSelection } from "../types";

type SavedPaymentMethodOptionProps = {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (selection: CheckoutPaymentSelection) => void;
};

export default function SavedPaymentMethodOption({
  method,
  isSelected,
  onSelect,
}: SavedPaymentMethodOptionProps) {
  const isDisabled =
    method.status === "expired" || method.tappayPrimeState !== "ready";
  const handleSelect = useCallback(() => {
    onSelect({ type: "saved", paymentMethodId: method.id });
  }, [method.id, onSelect]);

  return (
    <button
      type="button"
      className="focus-visible:ring-ring/30 rounded-3xl outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isDisabled}
      aria-pressed={isSelected}
      onClick={handleSelect}
    >
      <PaymentMethodSummary
        method={method}
        highlightPrimary={false}
        isSelected={isSelected}
        actions={isSelected && <Badge variant="outline">以此卡結帳</Badge>}
      />
    </button>
  );
}
