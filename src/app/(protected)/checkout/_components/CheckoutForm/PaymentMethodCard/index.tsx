"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TapPayHostedField from "@/components/shared/TapPayHostedField";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { useTapPayCardFields } from "@/providers/tappay/useTapPayCardFields";

type PaymentMethodCardProps = {
  onStatusChange: (canGetPrime: boolean) => void;
};

function noopTapPayStatusChange() {}

export default function PaymentMethodCard({
  onStatusChange = noopTapPayStatusChange,
}: PaymentMethodCardProps) {
  const { cardStatus, error, isHostedFieldVisible } = useTapPayCardFields({
    revealDelay: 180,
  });

  useEffect(() => {
    onStatusChange(cardStatus.canGetPrime);
  }, [cardStatus.canGetPrime, onStatusChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>信用卡付款方式</CardTitle>
        <CardDescription>
          使用 TapPay 信用卡安全欄位驗證，送出時只交換 prime。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 md:grid-cols-4">
          <TapPayHostedField
            name="number"
            className="md:col-span-2"
            status={cardStatus.status.number}
            canGetPrime={cardStatus.canGetPrime}
            hasInteracted={cardStatus.hasInteracted}
            isHostedFieldVisible={isHostedFieldVisible}
          />
          <TapPayHostedField
            name="expiry"
            status={cardStatus.status.expiry}
            canGetPrime={cardStatus.canGetPrime}
            hasInteracted={cardStatus.hasInteracted}
            isHostedFieldVisible={isHostedFieldVisible}
          />
          <TapPayHostedField
            name="ccv"
            status={cardStatus.status.ccv}
            canGetPrime={cardStatus.canGetPrime}
            hasInteracted={cardStatus.hasInteracted}
            isHostedFieldVisible={isHostedFieldVisible}
          />
        </FieldGroup>
        {error && <FieldError className="mt-4">{error}</FieldError>}
      </CardContent>
    </Card>
  );
}
