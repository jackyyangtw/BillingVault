import { plans } from "@/mocks/fixtures/plans";

export const checkoutPlans = plans.filter((plan) => plan.id !== "enterprise");
export const checkoutPlanIds = checkoutPlans.map((plan) => plan.id);
