import { FieldError, FieldGroup } from "@/components/ui/field";
import TapPayHostedField from "@/components/shared/TapPayHostedField";
import type { TapPayCardStatusSnapshot } from "@/providers/tappay/cardStatusStore";

type NewCardHostedFieldsProps = {
  cardStatus: TapPayCardStatusSnapshot;
  error: string;
  isHostedFieldVisible: boolean;
};

export default function NewCardHostedFields({
  cardStatus,
  error,
  isHostedFieldVisible,
}: NewCardHostedFieldsProps) {
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
