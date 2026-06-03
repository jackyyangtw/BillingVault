import { type BillingCycle, plans } from "@/mocks/fixtures/plans";
import type { PlanOptionData } from "../types";

const planSeats: Record<string, number> = {
  starter: 1,
  pro: 5,
  business: 25,
  enterprise: 100,
};

export function getPlanOptions(currentPlanId: string | null): PlanOptionData[] {
  const currentPlanIndex = currentPlanId
    ? plans.findIndex((plan) => plan.id === currentPlanId)
    : -1;

  return plans.map((plan, index) => ({
    id: plan.id,
    name: plan.name,
    price: getPlanPriceLabel(plan, "monthly"),
    fit: plan.description,
    action: getPlanAction(plan.id, index, currentPlanId, currentPlanIndex),
  }));
}

export function getPlanName(planId: string) {
  return plans.find((plan) => plan.id === planId)?.name ?? planId;
}

export function getPlanSeats(planId: string) {
  return planSeats[planId] ?? 1;
}

function getPlanAction(
  planId: string,
  planIndex: number,
  currentPlanId: string | null,
  currentPlanIndex: number,
): PlanOptionData["action"] {
  if (planId === currentPlanId) {
    return "current";
  }

  if (planId === "enterprise") {
    return "contact";
  }

  if (currentPlanIndex === -1 || planIndex > currentPlanIndex) {
    return "upgrade";
  }

  return "downgrade";
}

function getPlanPriceLabel(plan: (typeof plans)[number], cycle: BillingCycle) {
  const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  if (price === null) {
    return "洽詢報價";
  }

  return `$${price}/月`;
}
