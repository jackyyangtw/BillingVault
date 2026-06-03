import { products } from "@/mocks/fixtures/products";
import type { BillingCycle } from "@/mocks/fixtures/plans";

export function getProductName(productId: string) {
  return (
    products.find((product) => product.id === productId)?.name ?? productId
  );
}

export function toBillingCycle(cycle: string): BillingCycle {
  return cycle === "yearly" ? "yearly" : "monthly";
}

export function centsToAmount(amountCents: number) {
  return amountCents / 100;
}

export function getShortSubscriptionId(id: string) {
  return `SUB-${id.slice(0, 8).toUpperCase()}`;
}
