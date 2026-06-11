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
import type { BillingCycle } from "@/mocks/plans";
import type { CheckoutFormValues } from "@/app/(protected)/checkout/_components/CheckoutForm/schema";
import LockedFieldValue from "./LockedFieldValue";

type CycleFieldProps = {
  currentCycle: BillingCycle | null;
};

export default function CycleField({ currentCycle }: CycleFieldProps) {
  const form = useFormContext<CheckoutFormValues>();
  const isLocked = currentCycle !== null;

  return (
    <Controller
      name="cycle"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="cycle">付款週期</FieldLabel>
          {isLocked && (
            <FieldDescription className="flex items-start gap-2 text-xs">
              <Info
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-cyan-500"
              />
              <span>
                如要更改訂閱週期，請回{" "}
                <Link
                  href="/account/subscription"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  訂閱管理
                </Link>{" "}
                變更方案。
              </span>
            </FieldDescription>
          )}
          {isLocked ? (
            <LockedFieldValue id="cycle" isInvalid={fieldState.invalid}>
              {field.value === "monthly" ? "月繳" : "年繳"}
            </LockedFieldValue>
          ) : (
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
                  <SelectItem value="monthly">月繳</SelectItem>
                  <SelectItem value="yearly">年繳</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
