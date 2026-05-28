import { FieldGroup } from "@/components/ui/field";
import TapPayHostedField from "@/components/shared/TapPayHostedField";
import type { TapPayCardUpdate } from "@/providers/tappay/tappay";

type TapPayBindFieldsProps = {
  cardStatus: Pick<TapPayCardUpdate, "canGetPrime" | "status"> & {
    hasInteracted: boolean;
  };
  areFieldsVisible: boolean;
};

export default function TapPayBindFields({
  cardStatus,
  areFieldsVisible,
}: TapPayBindFieldsProps) {
  return (
    <FieldGroup className="grid gap-4 md:grid-cols-4">
      <TapPayHostedField
        name="number"
        className="md:col-span-2"
        status={cardStatus.status.number}
        canGetPrime={cardStatus.canGetPrime}
        hasInteracted={cardStatus.hasInteracted}
        isHostedFieldVisible={areFieldsVisible}
      />
      <TapPayHostedField
        name="expiry"
        status={cardStatus.status.expiry}
        canGetPrime={cardStatus.canGetPrime}
        hasInteracted={cardStatus.hasInteracted}
        isHostedFieldVisible={areFieldsVisible}
      />
      <TapPayHostedField
        name="ccv"
        status={cardStatus.status.ccv}
        canGetPrime={cardStatus.canGetPrime}
        hasInteracted={cardStatus.hasInteracted}
        isHostedFieldVisible={areFieldsVisible}
      />
    </FieldGroup>
  );
}
