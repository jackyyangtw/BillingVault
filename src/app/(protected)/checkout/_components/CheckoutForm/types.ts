import type { Product } from "@/mocks/fixtures/products";
import type { BillingCycle, Plan } from "@/mocks/fixtures/plans";

export type CheckoutSummary = {
  selectedPlan: Plan;
  selectedProduct: Product;
  cycle: BillingCycle;
  planPrice: string;
  productPrice: number;
  total: string;
};
