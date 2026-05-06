import type { InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/tailwind-css/utils";
import type { CheckoutFormValues } from "./schema";

type ControlledTextFieldProps = {
  name: keyof CheckoutFormValues;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function ControlledTextField({
  name,
  label,
  ...props
}: ControlledTextFieldProps) {
  const form = useFormContext<CheckoutFormValues>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            {...props}
            id={name}
            value={field.value ?? ""}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={cn("text-right text-sm", strong && "text-xl font-bold")}>
        {value}
      </span>
    </div>
  );
}

export function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/30 rounded-3xl border p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
