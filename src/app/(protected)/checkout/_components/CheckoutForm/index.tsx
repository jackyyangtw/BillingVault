"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSubmitCheckout } from "@/features/checkout/queries/useSubmitCheckout";
import BillingInfoCard from "./BillingInfoCard";
import CheckoutPendingDialog from "./CheckoutPendingDialog";
import CheckoutSteps from "./CheckoutSteps";
import OrderSummary from "./OrderSummary";
import PaymentMethodCard from "./PaymentMethodCard";
import PlanSelector from "./PlanSelector";
import { type CheckoutFormValues, checkoutFormSchema } from "./schema";
import type { CheckoutFormProps } from "./types";
import { useCheckoutPaymentMethod } from "./useCheckoutPaymentMethod";
import { useCheckoutSummary } from "./useCheckoutSummary";
import { getCheckoutDefaultValues } from "./utils";

export default function CheckoutForm({
  initialPlanId,
  initialProductIds,
  initialCycle,
  initialCompanyName,
  initialBillingEmail,
  currentPlanId,
  currentCycle,
}: CheckoutFormProps) {
  const router = useRouter();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [paymentError, setPaymentError] = useState("");
  const { mutateAsync: submitCheckoutOrder, isPending: isCheckoutPending } =
    useSubmitCheckout();
  const defaultValues = useMemo<CheckoutFormValues>(
    () =>
      getCheckoutDefaultValues({
        initialPlanId,
        initialProductIds,
        initialCycle,
        initialCompanyName,
        initialBillingEmail,
      }),
    [
      initialBillingEmail,
      initialCompanyName,
      initialCycle,
      initialPlanId,
      initialProductIds,
    ],
  );
  const form = useForm<CheckoutFormValues>({
    resolver: standardSchemaResolver(checkoutFormSchema),
    mode: "onTouched",
    defaultValues,
  });

  const summary = useCheckoutSummary(form.control);
  const clearPaymentError = useCallback(() => setPaymentError(""), []);
  const { paymentCardProps, canSubmitPayment, getSubmitPaymentInput } =
    useCheckoutPaymentMethod({
      onPaymentReady: clearPaymentError,
    });
  const isSubmitting = form.formState.isSubmitting || isCheckoutPending;

  const submitCheckout = useCallback(
    async (values: CheckoutFormValues, simulatePaymentFailure: boolean) => {
      try {
        const paymentInput = await getSubmitPaymentInput();
        const result = await submitCheckoutOrder({
          ...values,
          ...paymentInput,
          idempotencyKey,
          simulatePaymentFailure,
        });
        const query = `order=${encodeURIComponent(result.orderNumber)}`;

        if (result.status === "failed") {
          router.replace(`/checkout/failure?${query}`);
          return;
        }

        router.replace(`/checkout/success?${query}`);
      } catch (error) {
        setPaymentError(
          error instanceof Error ? error.message : "結帳流程建立失敗。",
        );
      }
    },
    [getSubmitPaymentInput, idempotencyKey, router, submitCheckoutOrder],
  );

  const handleValidSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      await submitCheckout(values, false);
    },
    [submitCheckout],
  );

  const handleFailure = useCallback(() => {
    form.handleSubmit((values) => submitCheckout(values, true))();
  }, [form, submitCheckout]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleValidSubmit)}
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="flex flex-col gap-6">
          <CheckoutSteps />
          <PlanSelector
            currentPlanId={currentPlanId}
            currentCycle={currentCycle}
          />
          <BillingInfoCard />
          <PaymentMethodCard {...paymentCardProps} />
        </div>

        <OrderSummary
          summary={summary}
          isValid={form.formState.isValid && canSubmitPayment}
          isSubmitting={isSubmitting}
          paymentError={paymentError}
          onFailure={handleFailure}
        />
      </form>
      <CheckoutPendingDialog isOpen={isSubmitting} />
    </FormProvider>
  );
}
