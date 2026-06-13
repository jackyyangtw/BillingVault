import { CheckCircle2 } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/tailwind-css/utils";
import { TAPPAY_CARD_FIELDS } from "@/providers/tappay/cardSetup";
import type { TapPayFieldStatus } from "@/providers/tappay/tappay";

type TapPayFieldName = keyof TapPayFieldStatus;

const fieldLabels: Record<TapPayFieldName, string> = {
  number: "卡號",
  expiry: "到期日",
  ccv: "CVC",
};

const fieldDescriptions: Record<TapPayFieldName, string> = {
  number: "卡號由 TapPay 安全欄位處理，不會進入 BillingVault 狀態。",
  expiry: "格式為 MM / YY。",
  ccv: "輸入信用卡背面的 3 到 4 位安全碼。",
};

const fieldElementIds: Record<TapPayFieldName, string> = {
  number: TAPPAY_CARD_FIELDS.number,
  expiry: TAPPAY_CARD_FIELDS.expirationDate,
  ccv: TAPPAY_CARD_FIELDS.ccv,
};

type TapPayHostedFieldProps = {
  name: TapPayFieldName;
  status: number;
  canGetPrime: boolean;
  hasInteracted: boolean;
  isHostedFieldVisible?: boolean;
  className?: string;
};

export default function TapPayHostedField({
  name,
  status,
  canGetPrime,
  hasInteracted,
  isHostedFieldVisible = true,
  className,
}: TapPayHostedFieldProps) {
  const statusCode = Number(status);
  const message = getTapPayFieldMessage(name, statusCode, hasInteracted);
  const isInvalid = !!message;
  const isValid = hasInteracted && (canGetPrime || statusCode === 0);

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel
        htmlFor={fieldElementIds[name]}
        className={cn(isValid && "text-green-500")}
      >
        {fieldLabels[name]}
        {isValid && (
          <CheckCircle2 aria-hidden="true" className="text-green-500" />
        )}
      </FieldLabel>
      <div
        id={fieldElementIds[name]}
        aria-invalid={isInvalid}
        className={cn(
          "tappay-field bg-input/50 ring-offset-background h-9 overflow-hidden rounded-3xl border border-transparent px-3 py-1 text-base transition-[color,box-shadow,background-color] md:text-sm",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "[&_iframe]:block [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 [&_iframe]:transition-opacity",
          !isHostedFieldVisible && "[&_iframe]:opacity-0",
          isValid && "border-green-500 ring-3 ring-green-500/30",
          isInvalid && "border-destructive ring-destructive/20",
        )}
      />
      {isInvalid ? (
        <FieldError>{message}</FieldError>
      ) : isValid ? (
        <FieldDescription className="text-green-500">
          {fieldLabels[name]}有效。
        </FieldDescription>
      ) : (
        <FieldDescription>{fieldDescriptions[name]}</FieldDescription>
      )}
    </Field>
  );
}

function getTapPayFieldMessage(
  name: TapPayFieldName,
  status: number,
  hasInteracted: boolean,
) {
  if (!hasInteracted || status !== 2) {
    return "";
  }

  return `${fieldLabels[name]}格式不正確。`;
}
