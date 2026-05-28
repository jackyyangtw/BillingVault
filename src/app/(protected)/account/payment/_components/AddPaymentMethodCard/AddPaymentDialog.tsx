"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { addPaymentFormSchema, type AddPaymentFormValues } from "./schema";

type AddPaymentDialogProps = {
  onOpenChange: (open: boolean) => void;
};

const addPaymentDefaultValues: AddPaymentFormValues = {
  cardHolder: "",
  billingEmail: "",
};

export default function AddPaymentDialog({
  onOpenChange,
}: AddPaymentDialogProps) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const form = useForm<AddPaymentFormValues>({
    resolver: standardSchemaResolver(addPaymentFormSchema),
    mode: "onTouched",
    defaultValues: addPaymentDefaultValues,
  });
  const { cardStatus, error, isHostedFieldVisible } = useTapPayCardFields({
    revealDelay: 180,
    onReadyToPrime: () => setFormError(""),
  });
  const addPaymentMutation = useMutation({
    mutationFn: async (values: AddPaymentFormValues) => {
      const primeResult = await getTapPayPrime();
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prime: primeResult.card?.prime,
          cardHolder: values.cardHolder,
          billingEmail: values.billingEmail,
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

      return payload;
    },
    onSuccess: () => {
      form.reset();
      resetTapPayCardStatus();
      onOpenChange(false);
      toast.success("綁卡成功");
      router.refresh();
    },
    onError: (error) => {
      setFormError(
        error instanceof Error ? error.message : "付款方式新增失敗。",
      );
    },
  });
  const displayError = error || formError;

  function handleValidSubmit(values: AddPaymentFormValues) {
    if (!cardStatus.canGetPrime) {
      setFormError("請確認信用卡欄位都已正確填寫。");
      return;
    }

    setFormError("");
    addPaymentMutation.mutate(values);
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

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleValidSubmit)}>
          <AddPaymentFormFields
            cardStatus={cardStatus}
            error={displayError}
            areFieldsVisible={isHostedFieldVisible}
            isSubmitting={addPaymentMutation.isPending}
          />
        </form>
      </FormProvider>
    </DialogContent>
  );
}
