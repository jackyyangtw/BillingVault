import { Info } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products } from "@/mocks/fixtures/products";
import {
  type BillingCycle,
  isBillingCycleDowngrade,
  isPlanDowngrade,
  plans,
} from "@/mocks/fixtures/plans";
import type { CheckoutFormValues } from "./schema";

type PlanSelectorProps = {
  currentPlanId: string | null;
  currentCycle: BillingCycle | null;
};

export default function PlanSelector({
  currentPlanId,
  currentCycle,
}: PlanSelectorProps) {
  const form = useFormContext<CheckoutFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>選擇方案</CardTitle>
        <CardDescription>方案與產品都會帶入右側訂單摘要。</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Controller
            name="planId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="planId">訂閱方案</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="planId"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="選擇方案" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {plans.map((plan) => (
                        <SelectItem
                          key={plan.id}
                          value={plan.id}
                          disabled={isPlanDowngrade(currentPlanId, plan.id)}
                        >
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="productIds"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-2"
              >
                <FieldLabel>SaaS 產品</FieldLabel>
                <p className="text-muted-foreground flex items-start gap-2 text-sm leading-6">
                  <Info
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-cyan-500"
                  />
                  <span>
                    因為這是
                    demo，可購買已有商品是正常現象，主要用來體驗結帳流程。
                  </span>
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {products.map((product) => {
                    const inputId = `product-${product.id}`;
                    const checked = field.value.includes(product.id);

                    return (
                      <label
                        key={product.id}
                        htmlFor={inputId}
                        className="bg-input/40 has-checked:border-primary has-checked:bg-primary/10 flex min-h-24 cursor-pointer flex-col gap-2 rounded-3xl border border-transparent p-4 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              field.onChange(
                                checked
                                  ? field.value.filter(
                                      (productId) => productId !== product.id,
                                    )
                                  : [...field.value, product.id],
                              )
                            }
                            className="accent-primary size-4"
                          />
                          <span className="font-medium">{product.name}</span>
                        </span>
                        <span className="text-muted-foreground text-sm leading-6">
                          {product.tagline}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="cycle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cycle">付款週期</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="cycle"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="選擇週期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        value="monthly"
                        disabled={isBillingCycleDowngrade(
                          currentCycle,
                          "monthly",
                        )}
                      >
                        月繳
                      </SelectItem>
                      <SelectItem value="yearly">年繳</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
