import { useMutation } from "@tanstack/react-query";
import {
  type ChangeSubscriptionPlanInput,
  changeSubscriptionPlanAction,
} from "@/features/subscriptions/actions/changeSubscriptionPlan";
import { subscriptionsMutationKeys } from "@/features/subscriptions/queries/keys";

export function useChangeSubscriptionPlan(subscriptionId: string | null) {
  return useMutation({
    mutationKey: subscriptionsMutationKeys.changePlan(subscriptionId ?? "none"),
    mutationFn: (input: ChangeSubscriptionPlanInput) =>
      changeSubscriptionPlanAction(input),
  });
}
