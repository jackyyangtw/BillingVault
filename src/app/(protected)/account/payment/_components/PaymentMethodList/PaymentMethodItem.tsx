import type { PaymentMethod } from "@/features/payment-methods/dal/types";
import PaymentMethodSummary from "@/features/payment-methods/components/PaymentMethodSummary";
import PaymentMethodActions from "../PaymentMethodActions";
import PaymentMethodDefaultButton from "../PaymentMethodDefaultButton";

type PaymentMethodItemProps = {
  method: PaymentMethod;
};

export default function PaymentMethodItem({ method }: PaymentMethodItemProps) {
  const isPrimary = method.status === "primary";

  return (
    <PaymentMethodSummary
      method={method}
      actions={
        <>
          {method.status !== "primary" && (
            <PaymentMethodDefaultButton
              id={method.id}
              disabled={method.status === "expired"}
            />
          )}
          {!isPrimary && <PaymentMethodActions method={method} />}
        </>
      }
    />
  );
}
