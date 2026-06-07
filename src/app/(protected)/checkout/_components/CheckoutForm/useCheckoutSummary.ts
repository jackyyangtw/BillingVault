"use client";

import { useMemo } from "react";
import { type Control, useWatch } from "react-hook-form";
import { formatTwdAmount } from "@/lib/currency";
import { products } from "@/mocks/fixtures/products";
import { formatPlanPrice, getPlanById, plans } from "@/mocks/fixtures/plans";
import type { CheckoutFormValues } from "./schema";

export function useCheckoutSummary(control: Control<CheckoutFormValues>) {
  const planId = useWatch({ control, name: "planId" });
  const watchedProductIds = useWatch({ control, name: "productIds" });
  const cycle = useWatch({ control, name: "cycle" });
  const productIdsKey = (watchedProductIds ?? []).join("|");

  return useMemo(() => {
    const productIds = productIdsKey ? productIdsKey.split("|") : [];
    const selectedPlan = getPlanById(planId) ?? plans[1];
    const selectedProducts = products.filter((product) =>
      productIds.includes(product.id),
    );
    const planPrice = formatPlanPrice(selectedPlan, cycle);
    const productRows = selectedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: formatTwdAmount(
        cycle === "monthly" ? product.price : product.price * 10,
      ),
    }));
    const productTotal = selectedProducts.reduce(
      (sum, product) =>
        sum + (cycle === "monthly" ? product.price : product.price * 10),
      0,
    );
    const total =
      selectedPlan.monthlyPrice === null
        ? "洽詢報價"
        : formatTwdAmount(
            (cycle === "monthly"
              ? selectedPlan.monthlyPrice
              : (selectedPlan.yearlyPrice ?? 0)) + productTotal,
          );

    return {
      selectedPlan,
      selectedProducts,
      cycle,
      planPrice,
      productRows,
      total,
    };
  }, [cycle, planId, productIdsKey]);
}
