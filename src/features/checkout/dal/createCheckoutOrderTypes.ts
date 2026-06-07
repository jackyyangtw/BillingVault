import type { appCurrency } from "@/lib/currency";
import type { BillingCycle } from "@/mocks/fixtures/plans";

export type CreateCheckoutOrderInput = {
  planId: string;
  productId?: string;
  productIds: string[];
  cycle: BillingCycle;
  companyName: string;
  billingEmail: string;
  taxId?: string;
  billingAddress: string;
  idempotencyKey: string;
  prime?: string;
  paymentMethodId?: string;
  card?: {
    binCode?: string;
    last4?: string;
    type?: number;
    issuer?: string;
    issuerZhTw?: string;
    cardIdentifier?: string;
    expMonth?: number;
    expYear?: number;
  };
  simulatePaymentFailure?: boolean;
};

export type CheckoutOrderResult = {
  status: "succeeded" | "failed";
  orderId: string;
  orderNumber: string;
  amountCents: number;
  currency: typeof appCurrency;
  providerTradeId: string;
  failureMessage?: string;
};
