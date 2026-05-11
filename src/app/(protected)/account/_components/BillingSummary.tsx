import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BillingSummaryItem } from "./types";

type BillingSummaryProps = {
  summary: BillingSummaryItem[];
};

export default function BillingSummary({ summary }: BillingSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>帳務總覽</CardTitle>
        <CardDescription>
          快速確認本期費用、付款健康度與使用量。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {summary.map((item) => (
            <div
              key={item.label}
              className="bg-muted/40 flex min-h-36 flex-col justify-between rounded-3xl border p-4"
            >
              <p className="text-muted-foreground text-sm">{item.label}</p>
              <div className="flex flex-col gap-2">
                <p className="text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>
                <p className="text-muted-foreground text-sm leading-6">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
