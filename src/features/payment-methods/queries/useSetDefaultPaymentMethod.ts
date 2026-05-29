import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultPaymentMethodAction } from "@/features/payment-methods/actions/setDefaultPaymentMethod";
import { paymentMethodsMutationKeys, paymentMethodsQueryKeys } from "./keys";

export function useSetDefaultPaymentMethod(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: paymentMethodsMutationKeys.setDefault(id),
    mutationFn: setDefaultPaymentMethodAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: paymentMethodsQueryKeys.all,
      });
    },
  });
}
