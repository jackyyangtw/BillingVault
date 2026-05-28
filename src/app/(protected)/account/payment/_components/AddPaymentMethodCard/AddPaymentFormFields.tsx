import { Controller, useFormContext } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TapPayCardStatusSnapshot } from "@/providers/tappay/cardStatusStore";
import TapPayBindFields from "./TapPayBindFields";
import type { AddPaymentFormValues } from "./schema";

type AddPaymentFormFieldsProps = {
  cardStatus: TapPayCardStatusSnapshot;
  error: string;
  areFieldsVisible: boolean;
  isSubmitting: boolean;
};

export default function AddPaymentFormFields({
  cardStatus,
  error,
  areFieldsVisible,
  isSubmitting,
}: AddPaymentFormFieldsProps) {
  const form = useFormContext<AddPaymentFormValues>();

  return (
    <FieldGroup>
      <Controller
        name="cardHolder"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>持卡人姓名</FieldLabel>
            <Input
              {...field}
              id={field.name}
              autoComplete="cc-name"
              placeholder="Wang Xiao Ming"
              aria-invalid={fieldState.invalid}
              required
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <TapPayBindFields
        cardStatus={cardStatus}
        areFieldsVisible={areFieldsVisible}
      />

      <Controller
        name="billingEmail"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>帳單 Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              autoComplete="email"
              placeholder="billing@securecart.dev"
              aria-invalid={fieldState.invalid}
              required
            />
            <FieldDescription>
              mock API 只保存非敏感付款方式摘要，不保存卡號或 CVC。
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {error && <FieldError>{error}</FieldError>}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            取消
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={!cardStatus.canGetPrime || isSubmitting}
        >
          {isSubmitting && (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          )}
          {isSubmitting ? "綁定中" : "儲存卡片"}
        </Button>
      </DialogFooter>
    </FieldGroup>
  );
}
