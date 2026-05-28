"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resetTapPayCardStatus } from "@/providers/tappay/cardStatusStore";
import { getTapPayPrime } from "@/providers/tappay/tappay";
import { useTapPayCardFields } from "@/providers/tappay/useTapPayCardFields";
import AddPaymentFormFields from "./AddPaymentFormFields";

type AddPaymentDialogProps = {
  onOpenChange: (open: boolean) => void;
};

export default function AddPaymentDialog({
  onOpenChange,
}: AddPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const { cardStatus, error, isHostedFieldVisible } = useTapPayCardFields({
    revealDelay: 180,
    onReadyToPrime: () => setFormError(""),
  });
  const displayError = error || formError;

  async function handleCardSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cardStatus.canGetPrime) {
      setFormError("請確認信用卡欄位都已正確填寫。");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const cardHolder = String(formData.get("cardHolder") ?? "");
    const billingEmail = String(formData.get("billingEmail") ?? "");

    setIsSubmitting(true);
    setFormError("");

    try {
      const primeResult = await getTapPayPrime();
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prime: primeResult.card?.prime,
          cardHolder,
          billingEmail,
          card: {
            last4: primeResult.card?.lastfour,
            type: primeResult.card?.type,
            issuer: primeResult.card?.issuer,
            issuerZhTw: primeResult.card?.issuer_zh_tw,
            cardIdentifier: primeResult.card_identifier,
          },
        }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "付款方式新增失敗。");
      }

      event.currentTarget.reset();
      resetTapPayCardStatus();
      onOpenChange(false);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "付款方式新增失敗。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>新增信用卡</DialogTitle>
        <DialogDescription>
          使用 TapPay hosted fields 取得 prime，後端目前以 mock
          流程建立付款方式。
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleCardSubmit}>
        <AddPaymentFormFields
          cardStatus={cardStatus}
          error={displayError}
          areFieldsVisible={isHostedFieldVisible}
          isSubmitting={isSubmitting}
        />
      </form>
    </DialogContent>
  );
}
