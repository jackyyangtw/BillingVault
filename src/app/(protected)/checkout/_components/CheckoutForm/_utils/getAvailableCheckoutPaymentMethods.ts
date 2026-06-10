import type { PaymentMethod } from "@/features/payment-methods/dal/types";

export function getAvailableCheckoutPaymentMethods(
  paymentMethods: PaymentMethod[],
) {
  return paymentMethods.filter(
    (method) =>
      method.status !== "expired" && method.tappayPrimeState === "ready",
  );
}
