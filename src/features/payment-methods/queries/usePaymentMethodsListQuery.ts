import { useQuery } from "@tanstack/react-query";
import { listPaymentMethodsAction } from "@/features/payment-methods/actions/listPaymentMethods";
import { paymentMethodsQueryKeys } from "./keys";

export const usePaymentMethodsListQuery = () => {
  return useQuery({
    queryKey: paymentMethodsQueryKeys.list(),
    queryFn: () => listPaymentMethodsAction(),
    staleTime: 2 * 60 * 1000,
  });
};
