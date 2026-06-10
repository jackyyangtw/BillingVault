"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { type SubmitCheckoutInput } from "@/features/checkout/actions/submitCheckout";
import { useSubmitCheckout } from "@/features/checkout/queries/useSubmitCheckout";
import type { CheckoutFormValues } from "../schema";

type CheckoutSubmitPaymentInput =
  | Pick<SubmitCheckoutInput, "paymentMethodId">
  | Pick<SubmitCheckoutInput, "prime" | "card">;

function createCheckoutAttemptKey() {
  return crypto.randomUUID();
}

export function useCheckoutSubmission() {
  const router = useRouter();
  const [idempotencyKey, setIdempotencyKey] = useState(
    createCheckoutAttemptKey,
  );
  const [paymentError, setPaymentError] = useState("");
  const { mutateAsync: submitCheckoutOrder, isPending } = useSubmitCheckout();

  const clearPaymentError = useCallback(() => setPaymentError(""), []);
  const resetAttemptKey = useCallback(() => {
    setIdempotencyKey(createCheckoutAttemptKey());
  }, []);
  const handleSubmissionError = useCallback(
    (error: unknown) => {
      resetAttemptKey();
      setPaymentError(
        error instanceof Error ? error.message : "結帳流程建立失敗。",
      );
    },
    [resetAttemptKey],
  );

  const submitCheckout = useCallback(
    async (
      values: CheckoutFormValues,
      paymentInput: CheckoutSubmitPaymentInput,
      simulatePaymentFailure: boolean,
    ) => {
      try {
        const result = await submitCheckoutOrder({
          ...values,
          ...paymentInput,
          idempotencyKey,
          simulatePaymentFailure,
        });
        const query = `order=${encodeURIComponent(result.orderNumber)}`;

        if (result.status === "failed") {
          resetAttemptKey();
          router.replace(`/checkout/failure?${query}`);
          return;
        }

        router.replace(`/checkout/success?${query}`);
      } catch (error) {
        handleSubmissionError(error);
      }
    },
    [
      handleSubmissionError,
      idempotencyKey,
      resetAttemptKey,
      router,
      submitCheckoutOrder,
    ],
  );

  return {
    clearPaymentError,
    handleSubmissionError,
    isCheckoutPending: isPending,
    paymentError,
    submitCheckout,
  };
}
