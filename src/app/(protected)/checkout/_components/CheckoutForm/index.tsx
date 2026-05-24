"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { products } from "@/mocks/fixtures/products";
import {
  type BillingCycle,
  formatPlanPrice,
  getPlanById,
  plans,
} from "@/mocks/fixtures/plans";
import BillingInfoCard from "./BillingInfoCard";
import CheckoutSteps from "./CheckoutSteps";
import OrderSummary from "./OrderSummary";
import PaymentMethodCard from "./PaymentMethodCard";
import PlanSelector from "./PlanSelector";
import { type CheckoutFormValues, checkoutFormSchema } from "./schema";
import { getTapPayPrime } from "@/providers/tappay/tappay";

type CheckoutFormProps = {
  initialPlanId: string;
  initialProductId: string;
  initialCycle: BillingCycle;
  initialCompanyName: string;
  initialBillingEmail: string;
};

export default function CheckoutForm({
  initialPlanId,
  initialProductId,
  initialCycle,
  initialCompanyName,
  initialBillingEmail,
}: CheckoutFormProps) {
  const router = useRouter();
  const [canGetTapPayPrime, setCanGetTapPayPrime] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const defaultValues = useMemo<CheckoutFormValues>(
    () => ({
      planId: initialPlanId,
      productId: initialProductId,
      cycle: initialCycle,
      companyName: initialCompanyName,
      billingEmail: initialBillingEmail,
      taxId: "",
      billingAddress: "",
    }),
    [
      initialBillingEmail,
      initialCompanyName,
      initialCycle,
      initialPlanId,
      initialProductId,
    ],
  );
  const form = useForm<CheckoutFormValues>({
    resolver: standardSchemaResolver(checkoutFormSchema),
    mode: "onTouched",
    defaultValues,
  });

  const planId = useWatch({ control: form.control, name: "planId" });
  const productId = useWatch({ control: form.control, name: "productId" });
  const cycle = useWatch({ control: form.control, name: "cycle" });
  const selectedPlan = getPlanById(planId) ?? plans[1];
  const selectedProduct =
    products.find((product) => product.id === productId) ?? products[0];
  const planPrice = formatPlanPrice(selectedPlan, cycle);
  const productPrice =
    cycle === "monthly" ? selectedProduct.price : selectedProduct.price * 10;
  const total =
    selectedPlan.monthlyPrice === null
      ? "洽詢報價"
      : `$${
          (cycle === "monthly"
            ? selectedPlan.monthlyPrice
            : (selectedPlan.yearlyPrice ?? 0)) + productPrice
        }`;
  const summary = {
    selectedPlan,
    selectedProduct,
    cycle,
    planPrice,
    productPrice,
    total,
  };

  function handleTapPayStatusChange(canGetPrime: boolean) {
    setCanGetTapPayPrime(canGetPrime);
    if (canGetPrime) {
      setPaymentError("");
    }
  }

  async function handleValidSubmit() {
    if (!canGetTapPayPrime) {
      setPaymentError("請確認信用卡欄位都已正確填寫。");
      return;
    }

    try {
      await getTapPayPrime();
      router.replace("/checkout/success");
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "TapPay prime 取得失敗。",
      );
    }
  }

  function handleFailure() {
    router.replace("/checkout/failure");
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleValidSubmit)}
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="flex flex-col gap-6">
          <CheckoutSteps />
          <PlanSelector />
          <BillingInfoCard />
          <PaymentMethodCard onStatusChange={handleTapPayStatusChange} />
        </div>

        <OrderSummary
          summary={summary}
          isValid={form.formState.isValid && canGetTapPayPrime}
          isSubmitting={form.formState.isSubmitting}
          paymentError={paymentError}
          onFailure={handleFailure}
        />
      </form>
    </FormProvider>
  );
}
