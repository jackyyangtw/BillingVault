import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import type { Product } from "@/mocks/products";
import type { BillingCycle, Plan } from "@/mocks/plans";

export type CheckoutFormProps = {
  initialPlanId: string;
  initialProductIds: string[];
  initialCycle: BillingCycle;
  initialCompanyName: string;
  initialBillingEmail: string;
  currentPlanId: string | null;
  currentCycle: BillingCycle | null;
};

export type CheckoutSummary = {
  selectedPlan: Plan;
  selectedProducts: Product[];
  cycle: BillingCycle;
  planPrice: string;
  productRows: {
    id: string;
    name: string;
    price: string;
  }[];
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
  selectedPayment: CheckoutPaymentSelection;
  onPaymentSelectionChange: (selection: CheckoutPaymentSelection) => void;
  onPaymentReady?: () => void;
};
