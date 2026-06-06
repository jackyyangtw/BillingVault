import {
  processTapPaySandboxPayment,
  processTapPaySandboxTokenPayment,
} from "@/features/checkout/payments/processTapPaySandboxPayment";
import type { CheckoutPaymentSource } from "./checkoutPaymentSource";

export async function processCheckoutPayment({
  orderNumber,
  amountCents,
  paymentSource,
  details,
  cardholder,
  simulateFailure,
}: {
  orderNumber: string;
  amountCents: number;
  paymentSource: CheckoutPaymentSource;
  details: string;
  cardholder: {
    name: string;
    email: string;
    address: string;
  };
  simulateFailure?: boolean;
}) {
  if (paymentSource.type === "token") {
    return processTapPaySandboxTokenPayment({
      orderNumber,
      amountCents,
      cardKey: paymentSource.cardKey,
      cardToken: paymentSource.cardToken,
      details,
      cardholder,
      simulateFailure,
    });
  }

  return processTapPaySandboxPayment({
    orderNumber,
    amountCents,
    prime: paymentSource.prime,
    details,
    cardholder,
    simulateFailure,
  });
}
