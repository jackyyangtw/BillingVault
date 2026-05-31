"use client";

import { useMemo } from "react";
import { type Control, useWatch } from "react-hook-form";
import { products } from "@/mocks/fixtures/products";
import { formatPlanPrice, getPlanById, plans } from "@/mocks/fixtures/plans";
import type { CheckoutFormValues } from "./schema";

export function useCheckoutSummary(control: Control<CheckoutFormValues>) {
  const planId = useWatch({ control, name: "planId" });
  const productId = useWatch({ control, name: "productId" });
  const cycle = useWatch({ control, name: "cycle" });
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

  return useMemo(
    () => ({
      selectedPlan,
      selectedProduct,
      cycle,
      planPrice,
      productPrice,
      total,
    }),
    [cycle, planPrice, productPrice, selectedPlan, selectedProduct, total],
  );
}
