"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BillingInfoCard from "./BillingInfoCard";
import CheckoutPendingDialog from "./CheckoutPendingDialog";
import CheckoutSteps from "./CheckoutSteps";
import OrderSummary from "./OrderSummary";
import PaymentMethodCard from "./PaymentMethodCard";
import PlanSelector from "./PlanSelector";
import { type CheckoutFormValues, checkoutFormSchema } from "./schema";
import type { CheckoutFormProps } from "./types";
import { useCheckoutPaymentMethod } from "./_hooks/useCheckoutPaymentMethod";
import { useCheckoutSummary } from "./_hooks/useCheckoutSummary";
import { useCheckoutSubmission } from "./_hooks/useCheckoutSubmission";
import { getCheckoutDefaultValues } from "./_utils/getCheckoutDefaultValues";

export default function CheckoutForm({
  initialPlanId,
  initialProductIds,
  initialCycle,
  initialCompanyName,
  initialBillingEmail,
  currentPlanId,
  currentCycle,
}: CheckoutFormProps) {
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
  const {
    clearPaymentError,
    handleSubmissionError,
    isCheckoutPending,
    paymentError,
    submitCheckout,
  } = useCheckoutSubmission();
  const { paymentCardProps, canSubmitPayment, getSubmitPaymentInput } =
    useCheckoutPaymentMethod({
      onPaymentReady: clearPaymentError,
    });
  const isSubmitting = form.formState.isSubmitting || isCheckoutPending;

  const handleValidSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      try {
        const paymentInput = await getSubmitPaymentInput();

        await submitCheckout(values, paymentInput, false);
      } catch (error) {
        handleSubmissionError(error);
      }
    },
    [getSubmitPaymentInput, handleSubmissionError, submitCheckout],
  );

  const handleFailure = useCallback(() => {
    form.handleSubmit(async (values) => {
      try {
        const paymentInput = await getSubmitPaymentInput();

        await submitCheckout(values, paymentInput, true);
      } catch (error) {
        handleSubmissionError(error);
      }
    })();
  }, [form, getSubmitPaymentInput, handleSubmissionError, submitCheckout]);

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
