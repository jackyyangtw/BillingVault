import type {
  PlanOptionData,
  ScheduledSubscriptionChangeData,
} from "@/features/subscriptions/dal/types";
import type { BillingCycle } from "@/mocks/plans";
import type { PlanOptionAction } from "./PlanOption";

type PlanOptionStateInput = {
  plan: PlanOptionData;
  currentPlanId: string | null;
  currentCycle: BillingCycle | null;
  scheduledChange: ScheduledSubscriptionChangeData | null;
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
  scheduledChange,
  selectedDisplayCycle,
}: PlanOptionStateInput) {
  if (plan.id === currentPlanId && selectedDisplayCycle === currentCycle) {
    return "使用中";
  }

  if (
    scheduledChange &&
    scheduledChange.toPlanId === plan.id &&
    scheduledChange.toCycle === selectedDisplayCycle
  ) {
    return "目標方案";
  }

  return null;
}
