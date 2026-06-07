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
        <FieldGroup className="grid gap-4 md:grid-cols-3">
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
            name="productId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="productId">SaaS 產品</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="productId"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="選擇產品" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
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
