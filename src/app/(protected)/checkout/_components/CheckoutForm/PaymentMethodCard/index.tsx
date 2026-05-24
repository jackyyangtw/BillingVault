"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError, FieldGroup } from "@/components/ui/field";
import {
  type TapPayCardUpdate,
  tappayCardSetupConfig,
} from "@/providers/tappay/tappay";
import { useTapPay } from "@/providers/tappay";
import {
  getTapPayCardStatusSnapshot,
  resetTapPayCardStatus,
  subscribeTapPayCardStatus,
  updateTapPayCardStatus,
} from "@/providers/tappay/cardStatusStore";
import TapPayHostedField from "./TapPayHostedField";

type PaymentMethodCardProps = {
  onStatusChange: (canGetPrime: boolean) => void;
};

function noopTapPayStatusChange() {}

export default function PaymentMethodCard({
  onStatusChange = noopTapPayStatusChange,
}: PaymentMethodCardProps) {
  const tapPay = useTapPay();
  const cardStatus = useSyncExternalStore(
    subscribeTapPayCardStatus,
    getTapPayCardStatusSnapshot,
    getTapPayCardStatusSnapshot,
  );

  useEffect(() => {
    if (!tapPay.isReady || !window.TPDirect) {
      return;
    }

    let isMounted = true;

    window.TPDirect.card.setup(tappayCardSetupConfig);
    updateTapPayCardStatus(window.TPDirect.card.getTappayFieldsStatus());
    window.TPDirect.card.onUpdate((update: TapPayCardUpdate) => {
      if (!isMounted) {
        return;
      }

      updateTapPayCardStatus(update);
    });

    return () => {
      isMounted = false;
      resetTapPayCardStatus();
    };
  }, [tapPay.isReady]);

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
          />
          <TapPayHostedField
            name="expiry"
            status={cardStatus.status.expiry}
            canGetPrime={cardStatus.canGetPrime}
            hasInteracted={cardStatus.hasInteracted}
          />
          <TapPayHostedField
            name="ccv"
            status={cardStatus.status.ccv}
            canGetPrime={cardStatus.canGetPrime}
            hasInteracted={cardStatus.hasInteracted}
          />
        </FieldGroup>
        {tapPay.error && (
          <FieldError className="mt-4">{tapPay.error}</FieldError>
        )}
      </CardContent>
    </Card>
  );
}
