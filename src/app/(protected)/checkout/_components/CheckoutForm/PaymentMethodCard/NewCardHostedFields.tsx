"use client";

import { FieldError, FieldGroup } from "@/components/ui/field";
import TapPayHostedField from "@/components/shared/TapPayHostedField";
import { useTapPayCardFields } from "@/providers/tappay/useTapPayCardFields";

type NewCardHostedFieldsProps = {
  onReadyToPrime?: () => void;
};

export default function NewCardHostedFields({
  onReadyToPrime,
}: NewCardHostedFieldsProps) {
  const { cardStatus, error, isHostedFieldVisible } = useTapPayCardFields({
    enabled: true,
    revealDelay: 180,
    onReadyToPrime,
  });

  return (
    <div className="rounded-3xl border p-4">
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
    </div>
  );
}
