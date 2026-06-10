import type { BillingCycle } from "@/mocks/fixtures/plans";
import type { CheckoutFormValues } from "../schema";

type CheckoutDefaultValuesInput = {
  initialPlanId: string;
  initialProductIds: string[];
  initialCycle: BillingCycle;
  initialCompanyName: string;
  initialBillingEmail: string;
};

export function getCheckoutDefaultValues({
  initialPlanId,
  initialProductIds,
  initialCycle,
  initialCompanyName,
  initialBillingEmail,
}: CheckoutDefaultValuesInput): CheckoutFormValues {
  return {
    planId: initialPlanId,
    productIds: initialProductIds,
    cycle: initialCycle,
    companyName: initialCompanyName,
    billingEmail: initialBillingEmail,
    taxId: "",
    billingAddress: "",
  };
}
