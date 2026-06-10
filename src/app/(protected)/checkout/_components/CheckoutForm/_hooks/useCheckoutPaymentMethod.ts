"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import { usePaymentMethodsListQuery } from "@/features/payment-methods/queries/usePaymentMethodsListQuery";
import {
  getTapPayPrime,
  type TapPayPrimeResult,
} from "@/providers/tappay/tappay";
import {
  getTapPayCardStatusSnapshot,
  subscribeTapPayCardStatus,
} from "@/providers/tappay/cardStatusStore";
import type {
  CheckoutPaymentCardProps,
  CheckoutPaymentSelection,
} from "../types";

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

function getAvailableCheckoutPaymentMethods(paymentMethods: PaymentMethod[]) {
  return paymentMethods.filter(
    (method) =>
      method.status !== "expired" && method.tappayPrimeState === "ready",
  );
}

function getDefaultCheckoutPaymentSelection(
  availablePaymentMethods: PaymentMethod[],
): CheckoutPaymentSelection {
  const defaultPaymentMethod = availablePaymentMethods[0];

  if (defaultPaymentMethod) {
    return { type: "saved", paymentMethodId: defaultPaymentMethod.id };
  }

  return { type: "new" };
}

function toNewCardCheckoutInput(primeResult: TapPayPrimeResult) {
  return {
    prime: primeResult.card?.prime ?? "",
    card: {
      binCode: primeResult.card?.bincode,
      last4: primeResult.card?.lastfour,
      type: primeResult.card?.type,
      issuer: primeResult.card?.issuer,
      issuerZhTw: primeResult.card?.issuer_zh_tw,
      cardIdentifier: primeResult.card_identifier,
      expMonth: primeResult.card?.expiry_month,
      expYear: primeResult.card?.expiry_year,
    },
  };
}
