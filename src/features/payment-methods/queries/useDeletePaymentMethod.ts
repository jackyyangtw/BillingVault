import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentMethodAction } from "@/features/payment-methods/actions/deletePaymentMethod";
import { paymentMethodsMutationKeys, paymentMethodsQueryKeys } from "./keys";

export function useDeletePaymentMethod(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: paymentMethodsMutationKeys.delete(id),
    mutationFn: deletePaymentMethodAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: paymentMethodsQueryKeys.all,
      });
    },
  });
}
