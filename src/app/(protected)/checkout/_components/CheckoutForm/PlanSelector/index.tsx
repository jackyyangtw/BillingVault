import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import type { BillingCycle } from "@/mocks/fixtures/plans";
import CycleField from "./CycleField";
import PlanField from "./PlanField";
import ProductsField from "./ProductsField";

type PlanSelectorProps = {
  currentPlanId: string | null;
  currentCycle: BillingCycle | null;
};

export default function PlanSelector({
  currentPlanId,
  currentCycle,
}: PlanSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>選擇方案</CardTitle>
        <CardDescription>方案與產品都會帶入右側訂單摘要。</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <PlanField currentPlanId={currentPlanId} />
          <ProductsField />
          <CycleField currentCycle={currentCycle} />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
