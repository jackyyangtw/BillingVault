import { products } from "@/mocks/fixtures/products";
import { type BillingCycle, plans } from "@/mocks/fixtures/plans";

type CheckoutPricingInput = {
  planId: string;
  productId: string;
  cycle: BillingCycle;
};

export type CheckoutPricing = {
  planName: string;
  productName: string;
  amountCents: number;
  currency: "USD";
};

export function calculateCheckoutPricing({
  planId,
  productId,
  cycle,
}: CheckoutPricingInput): CheckoutPricing {
  const plan = plans.find((candidate) => candidate.id === planId);
  const product = products.find((candidate) => candidate.id === productId);

  if (!plan || !product) {
    throw new Error("結帳方案或產品不存在。");
  }

  const planPrice = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  if (planPrice === null) {
    throw new Error("企業方案需聯繫業務，無法直接結帳。");
  }

  const productPrice = cycle === "monthly" ? product.price : product.price * 10;

  return {
    planName: plan.name,
    productName: product.name,
    amountCents: (planPrice + productPrice) * 100,
    currency: "USD",
  };
}
