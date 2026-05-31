"use client";

import { useCallback, useMemo, useState } from "react";
import { usePaymentMethodsListQuery } from "@/features/payment-methods/queries/usePaymentMethodsListQuery";
import { getTapPayPrime } from "@/providers/tappay/tappay";
import { useTapPayCardFields } from "@/providers/tappay/useTapPayCardFields";
import type {
  CheckoutPaymentCardProps,
  CheckoutPaymentSelection,
} from "./types";
import {
  getAvailableCheckoutPaymentMethods,
  getDefaultCheckoutPaymentSelection,
  toNewCardCheckoutInput,
} from "./utils";

type UseCheckoutPaymentMethodInput = {
  onPaymentReady?: () => void;
};

export function useCheckoutPaymentMethod({
  onPaymentReady,
}: UseCheckoutPaymentMethodInput = {}) {
  const [paymentSelectionOverride, setPaymentSelectionOverride] =
    useState<CheckoutPaymentSelection | null>(null);
  const {
    data: paymentMethods = [],
    isError: isPaymentMethodsError,
    isPending: isPaymentMethodsPending,
  } = usePaymentMethodsListQuery();

  const selectedPayment = useMemo<CheckoutPaymentSelection>(() => {
    if (paymentSelectionOverride) {
      return paymentSelectionOverride;
    }

    return getDefaultCheckoutPaymentSelection(
      getAvailableCheckoutPaymentMethods(paymentMethods),
    );
  }, [paymentMethods, paymentSelectionOverride]);
  const isNewCardSelected = selectedPayment.type === "new";
  const {
    cardStatus,
    error: tapPayError,
    isHostedFieldVisible,
  } = useTapPayCardFields({
    enabled: isNewCardSelected,
    revealDelay: 180,
    onReadyToPrime: onPaymentReady,
  });

  const handlePaymentSelectionChange = useCallback(
    (selection: CheckoutPaymentSelection) => {
      setPaymentSelectionOverride(selection);
      onPaymentReady?.();
    },
    [onPaymentReady],
  );

  const paymentCardProps = useMemo<CheckoutPaymentCardProps>(
    () => ({
      paymentMethods,
      isPaymentMethodsPending,
      isPaymentMethodsError,
      cardStatus,
      error: tapPayError,
      isHostedFieldVisible,
      selectedPayment,
      onPaymentSelectionChange: handlePaymentSelectionChange,
    }),
    [
      cardStatus,
      handlePaymentSelectionChange,
      isHostedFieldVisible,
      isPaymentMethodsError,
      isPaymentMethodsPending,
      paymentMethods,
      selectedPayment,
      tapPayError,
    ],
  );

  const canSubmitPayment =
    selectedPayment.type === "saved" || cardStatus.canGetPrime;

  const getSubmitPaymentInput = useCallback(async () => {
    if (selectedPayment.type === "saved") {
      return { paymentMethodId: selectedPayment.paymentMethodId };
    }

    if (!cardStatus.canGetPrime) {
      throw new Error("請確認信用卡欄位都已正確填寫。");
    }

    const primeResult = await getTapPayPrime();

    return toNewCardCheckoutInput(primeResult);
  }, [cardStatus.canGetPrime, selectedPayment]);

  return {
    paymentCardProps,
    canSubmitPayment,
    getSubmitPaymentInput,
  };
}
