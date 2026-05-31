import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type SubmitCheckoutInput,
  submitCheckoutAction,
} from "@/features/checkout/actions/submitCheckout";
import { checkoutMutationKeys } from "@/features/checkout/queries/keys";
import { paymentMethodsQueryKeys } from "@/features/payment-methods/queries/keys";

export function useSubmitCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: checkoutMutationKeys.submit(),
    mutationFn: (input: SubmitCheckoutInput) => submitCheckoutAction(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: paymentMethodsQueryKeys.all,
      });
    },
  });
}
