"use client";

import { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CheckoutPaymentCardProps } from "../types";
import NewCardHostedFields from "./NewCardHostedFields";
import NewPaymentMethodOption from "./NewPaymentMethodOption";
import SavedPaymentMethodOption from "./SavedPaymentMethodOption";

export default function PaymentMethodCard({
  paymentMethods,
  isPaymentMethodsPending,
  isPaymentMethodsError,
  selectedPayment,
  onPaymentSelectionChange,
  onPaymentReady,
}: CheckoutPaymentCardProps) {
  const isNewCardSelected = selectedPayment.type === "new";

  const selectNewCard = useCallback(() => {
    onPaymentSelectionChange({ type: "new" });
  }, [onPaymentSelectionChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>信用卡付款方式</CardTitle>
        <CardDescription>
          選擇已綁定卡片，或使用 TapPay 信用卡安全欄位新增一次性付款。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {isPaymentMethodsPending && (
            <div
              role="status"
              aria-live="polite"
              className="text-muted-foreground rounded-3xl border border-dashed p-6 text-sm leading-6"
            >
              載入已綁定卡片中…
            </div>
          )}

          {!isPaymentMethodsPending && isPaymentMethodsError && (
            <div
              role="alert"
              className="text-destructive rounded-3xl border border-dashed p-6 text-sm leading-6"
            >
              付款方式載入失敗，請改用新卡片付款或稍後再試。
            </div>
          )}

          {!isPaymentMethodsPending && paymentMethods.length > 0 && (
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <SavedPaymentMethodOption
                  key={method.id}
                  method={method}
                  isSelected={
                    selectedPayment.type === "saved" &&
                    selectedPayment.paymentMethodId === method.id
                  }
                  onSelect={onPaymentSelectionChange}
                />
              ))}
            </div>
          )}

          <NewPaymentMethodOption
            hasPaymentMethods={paymentMethods.length > 0}
            isSelected={isNewCardSelected}
            onSelect={selectNewCard}
          />

          {isNewCardSelected && (
            <NewCardHostedFields onReadyToPrime={onPaymentReady} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
