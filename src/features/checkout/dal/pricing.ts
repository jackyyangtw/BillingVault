import { appCurrency, twdAmountToCents } from "@/lib/currency";
import { products } from "@/mocks/fixtures/products";
import { type BillingCycle, plans } from "@/mocks/fixtures/plans";

type CheckoutPricingInput = {
  planId: string;
  productId?: string;
  productIds?: string[];
  cycle: BillingCycle;
};

export type CheckoutPricing = {
  planName: string;
  productName: string;
  productNames: string[];
  productLineItems: {
    productId: string;
    productName: string;
    amountCents: number;
  }[];
  amountCents: number;
  currency: typeof appCurrency;
};

export function calculateCheckoutPricing(
  input: CheckoutPricingInput,
): CheckoutPricing {
  const { planId, cycle } = input;
  const productIds = getCheckoutProductIds(input);
  const plan = plans.find((candidate) => candidate.id === planId);
  const selectedProducts = productIds.map((productId) =>
    products.find((candidate) => candidate.id === productId),
  );

  if (!plan || selectedProducts.some((product) => !product)) {
    throw new Error("結帳方案或產品不存在。");
  }

  const planPrice = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  if (planPrice === null) {
    throw new Error("企業方案需聯繫業務，無法直接結帳。");
  }

  const productLineItems = selectedProducts.map((product) => {
    if (!product) {
      throw new Error("結帳方案或產品不存在。");
    }

    return {
      productId: product.id,
      productName: product.name,
      amountCents: twdAmountToCents(
        cycle === "monthly" ? product.price : product.price * 10,
      ),
    };
  });
  const productAmountCents = productLineItems.reduce(
    (sum, item) => sum + item.amountCents,
    0,
  );
  const productNames = productLineItems.map((item) => item.productName);

  return {
    planName: plan.name,
    productName: productNames.join("、"),
    productNames,
    productLineItems,
    amountCents: twdAmountToCents(planPrice) + productAmountCents,
    currency: appCurrency,
  };
}

function getCheckoutProductIds(input: CheckoutPricingInput) {
  const productIds = input.productIds?.length
    ? input.productIds
    : input.productId
      ? [input.productId]
      : [];
  const uniqueProductIds = [...new Set(productIds)];

  if (uniqueProductIds.length === 0) {
    throw new Error("請至少選擇一個 SaaS 產品。");
  }

  return uniqueProductIds;
}
