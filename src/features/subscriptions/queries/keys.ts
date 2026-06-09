export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
};

export const subscriptionsMutationKeys = {
  changePlan: (subscriptionId: string) =>
    [...subscriptionsQueryKeys.all, "change-plan", subscriptionId] as const,
  cancel: (subscriptionId: string) =>
    [...subscriptionsQueryKeys.all, "cancel", subscriptionId] as const,
};
