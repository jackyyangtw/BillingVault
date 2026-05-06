"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import CheckoutSuccess from "./CheckoutSuccess";
import OrderSummary from "./OrderSummary";
import PaymentMethodCard from "./PaymentMethodCard";
import PlanSelector from "./PlanSelector";
import { type CheckoutFormValues, checkoutFormSchema } from "./schema";

type CheckoutFormProps = {
  initialPlanId: string;
  initialProductId: string;
  initialCycle: BillingCycle;
};

export default function CheckoutForm({
  initialPlanId,
  initialProductId,
  initialCycle,
}: CheckoutFormProps) {
  const [finished, setFinished] = useState(false);
  const defaultValues = useMemo<CheckoutFormValues>(
    () => ({
      planId: initialPlanId,
      productId: initialProductId,
      cycle: initialCycle,
      companyName: "",
      billingEmail: "",
      taxId: "",
      billingAddress: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    }),
    [initialCycle, initialPlanId, initialProductId],
  );
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
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

  function handleValidSubmit(values: CheckoutFormValues) {
    void values;
    setFinished(true);
  }

  function handleReset() {
    form.reset(defaultValues);
    setFinished(false);
  }

  if (finished) {
    return <CheckoutSuccess summary={summary} onReset={handleReset} />;
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
          <PaymentMethodCard />
        </div>

        <OrderSummary
          summary={summary}
          isValid={form.formState.isValid}
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </FormProvider>
  );
}
