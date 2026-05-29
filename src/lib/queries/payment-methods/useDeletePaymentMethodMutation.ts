import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentMethodAction } from "@/lib/actions/payment-methods/deletePaymentMethod";
import { paymentMethodsQueryKey } from "./keys";

export function useDeletePaymentMethodMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["payment-methods", "delete", id],
    mutationFn: deletePaymentMethodAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: paymentMethodsQueryKey,
      });
    },
  });
}
