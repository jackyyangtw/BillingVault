import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentMethodAction } from "@/lib/actions/payment-methods/createPaymentMethod";
import { getTapPayPrime } from "@/providers/tappay/tappay";
import { paymentMethodsQueryKey } from "./keys";

type CreatePaymentMethodMutationInput = {
  cardHolder: string;
  billingEmail: string;
};

export function useCreatePaymentMethodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreatePaymentMethodMutationInput) => {
      const primeResult = await getTapPayPrime();

      return createPaymentMethodAction({
        prime: primeResult.card?.prime ?? "",
        cardHolder: values.cardHolder,
        billingEmail: values.billingEmail,
        card: {
          binCode: primeResult.card?.bincode,
          last4: primeResult.card?.lastfour,
          type: primeResult.card?.type,
          issuer: primeResult.card?.issuer,
          issuerZhTw: primeResult.card?.issuer_zh_tw,
          cardIdentifier: primeResult.card_identifier,
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: paymentMethodsQueryKey,
      });
    },
  });
}
