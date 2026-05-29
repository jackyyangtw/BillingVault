import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultPaymentMethodAction } from "@/lib/actions/payment-methods/setDefaultPaymentMethod";
import { paymentMethodsQueryKey } from "./keys";

export function useSetDefaultPaymentMethodMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["payment-methods", "set-default", id],
    mutationFn: setDefaultPaymentMethodAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: paymentMethodsQueryKey,
      });
    },
  });
}
