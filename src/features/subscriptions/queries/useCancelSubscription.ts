import { useMutation } from "@tanstack/react-query";
import { cancelSubscriptionAction } from "@/features/subscriptions/actions/cancelSubscription";
import { subscriptionsMutationKeys } from "@/features/subscriptions/queries/keys";

export function useCancelSubscription(subscriptionId: string) {
  return useMutation({
    mutationKey: subscriptionsMutationKeys.cancel(subscriptionId),
    mutationFn: cancelSubscriptionAction,
  });
}
