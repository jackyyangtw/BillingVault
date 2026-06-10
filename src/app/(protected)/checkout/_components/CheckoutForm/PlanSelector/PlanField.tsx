import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPlanById } from "@/mocks/fixtures/plans";
import type { CheckoutFormValues } from "@/app/(protected)/checkout/_components/CheckoutForm/schema";
import { checkoutPlans } from "../../../_utils/checkoutPlans";
import LockedFieldValue from "./LockedFieldValue";

type PlanFieldProps = {
  currentPlanId: string | null;
};

export default function PlanField({ currentPlanId }: PlanFieldProps) {
  const form = useFormContext<CheckoutFormValues>();

  if (currentPlanId) {
    return (
      <Field>
        <FieldLabel>訂閱方案</FieldLabel>
        <LockedFieldValue>
          {getPlanById(currentPlanId)?.name ?? currentPlanId}
        </LockedFieldValue>
        <p className="text-muted-foreground text-xs">
          若要更換方案，請前往{" "}
          <Link
            href="/account/subscription"
            className="text-primary underline-offset-4 hover:underline"
          >
            訂閱管理
          </Link>
          。
        </p>
      </Field>
    );
  }

  return (
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
                {checkoutPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
