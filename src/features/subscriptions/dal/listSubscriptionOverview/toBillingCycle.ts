import type { BillingCycle } from "@/mocks/fixtures/plans";

export function toBillingCycle(cycle: string): BillingCycle {
  return cycle === "yearly" ? "yearly" : "monthly";
}
