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
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="cardHolder">持卡人姓名</FieldLabel>
        <Input
          id="cardHolder"
          name="cardHolder"
          autoComplete="cc-name"
          placeholder="Wang Xiao Ming"
          required
        />
      </Field>

      <TapPayBindFields
        cardStatus={cardStatus}
        areFieldsVisible={areFieldsVisible}
      />

      <Field>
        <FieldLabel htmlFor="billingEmail">帳單 Email</FieldLabel>
        <Input
          id="billingEmail"
          name="billingEmail"
          type="email"
          autoComplete="email"
          placeholder="billing@securecart.dev"
          required
        />
        <FieldDescription>
          mock API 只保存非敏感付款方式摘要，不保存卡號或 CVC。
        </FieldDescription>
      </Field>

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
          {isSubmitting ? "綁定中" : "儲存卡片"}
        </Button>
      </DialogFooter>
    </FieldGroup>
  );
}
