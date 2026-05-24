import { CreditCard, LockKeyhole, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CheckoutSummary } from "./types";
import { SummaryRow } from "./fields";

type OrderSummaryProps = {
  summary: CheckoutSummary;
  isValid: boolean;
  isSubmitting: boolean;
  onFailure: () => void;
};

export default function OrderSummary({
  summary,
  isValid,
  isSubmitting,
  onFailure,
}: OrderSummaryProps) {
  return (
    <Card className="h-fit lg:sticky lg:top-28">
      <CardHeader>
        <CardTitle>確認訂單</CardTitle>
        <CardDescription>送出後會顯示模擬成功結果。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <SummaryRow label="方案" value={summary.selectedPlan.name} />
        <SummaryRow label="方案費用" value={summary.planPrice} />
        <SummaryRow
          label="產品"
          value={`${summary.selectedProduct.name} $${summary.productPrice}`}
        />
        <SummaryRow
          label="付款週期"
          value={summary.cycle === "monthly" ? "月繳" : "年繳"}
        />
        <Separator />
        <SummaryRow label="總計" value={summary.total} strong />
        <div className="bg-muted/40 text-muted-foreground rounded-3xl border p-4 text-sm">
          <LockKeyhole className="text-primary mb-2 size-4" />
          模擬 tokenization、送出鎖定與安全付款回調，保留之後接 API 的介面位置。
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          <CreditCard data-icon="inline-start" />
          {isSubmitting ? "處理中" : "確認訂閱"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onFailure}
        >
          <ShieldAlert data-icon="inline-start" />
          模擬付款失敗
        </Button>
      </CardContent>
    </Card>
  );
}
