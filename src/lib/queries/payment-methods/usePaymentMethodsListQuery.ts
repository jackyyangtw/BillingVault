import { useQuery } from "@tanstack/react-query";
import { listPaymentMethodsAction } from "@/lib/actions/payment-methods/listPaymentMethods";
import { paymentMethodsQueryKey } from "./keys";

export const usePaymentMethodsListQuery = () => {
  return useQuery({
    queryKey: paymentMethodsQueryKey,
    queryFn: () => listPaymentMethodsAction(),
  });
};
