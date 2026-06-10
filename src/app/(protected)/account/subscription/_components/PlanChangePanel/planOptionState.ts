import type { PlanOptionData } from "@/features/subscriptions/dal/types";
import type { BillingCycle } from "@/mocks/fixtures/plans";
import type { PlanOptionAction } from "./PlanOption";

type PlanOptionStateInput = {
  plan: PlanOptionData;
  currentPlanId: string | null;
  currentCycle: BillingCycle | null;
  selectedDisplayCycle: BillingCycle;
};

export function getPlanOptionAction({
  plan,
  currentPlanId,
  currentCycle,
  selectedDisplayCycle,
}: PlanOptionStateInput): PlanOptionAction {
  const isCurrentPlanWithDifferentCycle =
    plan.id === currentPlanId &&
    currentCycle !== null &&
    selectedDisplayCycle !== currentCycle;

  if (!isCurrentPlanWithDifferentCycle || plan.action !== "current") {
    return plan.action;
  }

  return currentCycle === "yearly" && selectedDisplayCycle === "monthly"
    ? "downgrade"
    : "upgrade";
}

export function getPlanOptionStatusLabel({
  plan,
  currentPlanId,
  currentCycle,
  selectedDisplayCycle,
}: PlanOptionStateInput) {
  if (plan.id !== currentPlanId || currentCycle === null) {
    return null;
  }

  if (selectedDisplayCycle === currentCycle) {
    return "使用中";
  }

  return currentCycle === "yearly" && selectedDisplayCycle === "monthly"
    ? "目標方案"
    : null;
}
