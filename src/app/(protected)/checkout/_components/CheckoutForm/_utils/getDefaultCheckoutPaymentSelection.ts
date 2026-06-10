import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import type { CheckoutPaymentSelection } from "../types";

export function getDefaultCheckoutPaymentSelection(
  availablePaymentMethods: PaymentMethod[],
): CheckoutPaymentSelection {
  const defaultPaymentMethod = availablePaymentMethods[0];

  if (defaultPaymentMethod) {
    return { type: "saved", paymentMethodId: defaultPaymentMethod.id };
  }

  return { type: "new" };
}
