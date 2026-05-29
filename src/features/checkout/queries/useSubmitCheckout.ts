import { useMutation } from "@tanstack/react-query";
import {
  type SubmitCheckoutInput,
  submitCheckoutAction,
} from "@/features/checkout/actions/submitCheckout";
import { checkoutMutationKeys } from "@/features/checkout/queries/keys";

export function useSubmitCheckout() {
  return useMutation({
    mutationKey: checkoutMutationKeys.submit(),
    mutationFn: (input: SubmitCheckoutInput) => submitCheckoutAction(input),
  });
}
