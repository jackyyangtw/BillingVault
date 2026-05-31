import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import type { Product } from "@/mocks/fixtures/products";
import type { BillingCycle, Plan } from "@/mocks/fixtures/plans";
import type { TapPayCardStatusSnapshot } from "@/providers/tappay/cardStatusStore";

export type CheckoutFormProps = {
  initialPlanId: string;
  initialProductId: string;
  initialCycle: BillingCycle;
  initialCompanyName: string;
  initialBillingEmail: string;
};

export type CheckoutSummary = {
  selectedPlan: Plan;
  selectedProduct: Product;
  cycle: BillingCycle;
  planPrice: string;
  productPrice: number;
  total: string;
};

export type CheckoutPaymentSelection =
  | {
      type: "saved";
      paymentMethodId: string;
    }
  | {
      type: "new";
    };

export type CheckoutPaymentCardProps = {
  paymentMethods: PaymentMethod[];
  isPaymentMethodsPending: boolean;
  isPaymentMethodsError: boolean;
  cardStatus: TapPayCardStatusSnapshot;
  error: string;
  isHostedFieldVisible: boolean;
  selectedPayment: CheckoutPaymentSelection;
  onPaymentSelectionChange: (selection: CheckoutPaymentSelection) => void;
};
