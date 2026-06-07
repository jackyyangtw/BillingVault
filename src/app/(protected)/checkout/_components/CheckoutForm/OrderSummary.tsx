import { CreditCard, LockKeyhole, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import type { CheckoutSummary } from "./types";
import { SummaryRow } from "./fields";

type OrderSummaryProps = {
  summary: CheckoutSummary;
  isValid: boolean;
  isSubmitting: boolean;
  paymentError: string;
  onFailure: () => void;
};

export default function OrderSummary({
  summary,
  isValid,
  isSubmitting,
  paymentError,
  onFailure,
}: OrderSummaryProps) {
  return (
    <Card className="h-fit lg:sticky lg:top-28">
      <CardHeader>
        <CardTitle>確認訂單</CardTitle>
        <CardDescription>送出後會建立 sandbox 訂單與付款紀錄。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <SummaryRow label="方案" value={summary.selectedPlan.name} />
        <SummaryRow label="方案費用" value={summary.planPrice} />
        {summary.productRows.map((product) => (
          <SummaryRow
            key={product.id}
            label="產品"
            value={`${product.name} ${product.price}`}
          />
        ))}
        <SummaryRow
          label="付款週期"
          value={summary.cycle === "monthly" ? "月繳" : "年繳"}
        />
        <Separator />
        <SummaryRow label="總計" value={summary.total} strong />
        <div className="bg-muted/40 text-muted-foreground rounded-3xl border p-4 text-sm">
          <LockKeyhole className="text-primary mb-2 size-4" />
          TapPay hosted fields 只交換 prime，後端保存本地訂單與 sandbox
          交易狀態。
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
        {paymentError && <FieldError>{paymentError}</FieldError>}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onFailure}
          disabled={isSubmitting}
        >
          <ShieldAlert data-icon="inline-start" />
          模擬付款失敗
        </Button>
      </CardContent>
    </Card>
  );
}
