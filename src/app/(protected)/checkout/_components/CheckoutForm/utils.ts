import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import type { BillingCycle } from "@/mocks/fixtures/plans";
import type { TapPayPrimeResult } from "@/providers/tappay/tappay";
import type { CheckoutFormValues } from "./schema";
import type { CheckoutPaymentSelection } from "./types";

type CheckoutDefaultValuesInput = {
  initialPlanId: string;
  initialProductId: string;
  initialCycle: BillingCycle;
  initialCompanyName: string;
  initialBillingEmail: string;
};

export function getCheckoutDefaultValues({
  initialPlanId,
  initialProductId,
  initialCycle,
  initialCompanyName,
  initialBillingEmail,
}: CheckoutDefaultValuesInput): CheckoutFormValues {
  return {
    planId: initialPlanId,
    productId: initialProductId,
    cycle: initialCycle,
    companyName: initialCompanyName,
    billingEmail: initialBillingEmail,
    taxId: "",
    billingAddress: "",
  };
}

export function getAvailableCheckoutPaymentMethods(
  paymentMethods: PaymentMethod[],
) {
  return paymentMethods.filter(
    (method) =>
      method.status !== "expired" && method.tappayPrimeState === "ready",
  );
}

export function getDefaultCheckoutPaymentSelection(
  availablePaymentMethods: PaymentMethod[],
): CheckoutPaymentSelection {
  const defaultPaymentMethod = availablePaymentMethods[0];

  if (defaultPaymentMethod) {
    return { type: "saved", paymentMethodId: defaultPaymentMethod.id };
  }

  return { type: "new" };
}

export function toNewCardCheckoutInput(primeResult: TapPayPrimeResult) {
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
