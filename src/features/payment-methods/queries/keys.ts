export const paymentMethodsQueryKeys = {
  all: ["payment-methods"] as const,
  list: () => [...paymentMethodsQueryKeys.all, "list"] as const,
};

export const paymentMethodsMutationKeys = {
  create: () => [...paymentMethodsQueryKeys.all, "create"] as const,
  delete: (id: string) =>
    [...paymentMethodsQueryKeys.all, "delete", id] as const,
  setDefault: (id: string) =>
    [...paymentMethodsQueryKeys.all, "set-default", id] as const,
};
