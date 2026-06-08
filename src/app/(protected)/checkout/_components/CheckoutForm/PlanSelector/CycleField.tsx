import Link from "next/link";
import { Info } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
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
import {
  type BillingCycle,
  isBillingCycleDowngrade,
} from "@/mocks/fixtures/plans";
import type { CheckoutFormValues } from "@/app/(protected)/checkout/_components/CheckoutForm/schema";

type CycleFieldProps = {
  currentCycle: BillingCycle | null;
};

export default function CycleField({ currentCycle }: CycleFieldProps) {
  const form = useFormContext<CheckoutFormValues>();

  return (
    <Controller
      name="cycle"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="cycle">付款週期</FieldLabel>
          <FieldDescription className="flex items-start gap-2">
            <Info
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-cyan-500"
            />
            <span>
              選擇年繳後不可轉回月繳。如要體驗月繳，請回{" "}
              <Link
                href="/account/billing"
                className="text-primary underline-offset-4 hover:underline"
              >
                帳務管理
              </Link>{" "}
              左下角選單清除帳號資料，即可重置帳號。
            </span>
          </FieldDescription>
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
                  disabled={isBillingCycleDowngrade(currentCycle, "monthly")}
                >
                  月繳
                </SelectItem>
                <SelectItem value="yearly">年繳</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
