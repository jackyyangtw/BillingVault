"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { usePaymentMethodsListQuery } from "@/features/payment-methods/queries/usePaymentMethodsListQuery";
import { getTapPayPrime } from "@/providers/tappay/tappay";
import {
  getTapPayCardStatusSnapshot,
  subscribeTapPayCardStatus,
} from "@/providers/tappay/cardStatusStore";
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
  const cardStatus = useSyncExternalStore(
    subscribeTapPayCardStatus,
    getTapPayCardStatusSnapshot,
    getTapPayCardStatusSnapshot,
  );

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
      selectedPayment,
      onPaymentSelectionChange: handlePaymentSelectionChange,
      onPaymentReady,
    }),
    [
      handlePaymentSelectionChange,
      isPaymentMethodsError,
      isPaymentMethodsPending,
      onPaymentReady,
      paymentMethods,
      selectedPayment,
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
