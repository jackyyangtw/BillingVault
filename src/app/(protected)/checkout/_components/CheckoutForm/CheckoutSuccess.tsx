import Link from "next/link";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CheckoutSummary } from "./types";
import { ResultItem } from "./fields";

type CheckoutSuccessProps = {
  summary: CheckoutSummary;
  onReset: () => void;
};

export default function CheckoutSuccess({
  summary,
  onReset,
}: CheckoutSuccessProps) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="secondary" className="mb-2 w-fit">
          結帳結果
        </Badge>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CheckCircle2 className="text-primary size-6" />
          訂閱已建立
        </CardTitle>
        <CardDescription>
          這是模擬付款結果，代表前端已完成方案、帳務、付款與確認流程。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <ResultItem label="方案" value={summary.selectedPlan.name} />
          <ResultItem label="產品" value={summary.selectedProduct.name} />
          <ResultItem label="金額" value={summary.total} />
        </div>
        <div className="bg-muted/40 text-muted-foreground rounded-3xl border p-5 text-sm">
          Mock
          訂閱狀態：active。下一階段可接上帳務總覽、目前訂閱狀態、付款方式與帳單紀錄。
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/pricing">回到方案頁</Link>
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw data-icon="inline-start" />
            重新模擬
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
