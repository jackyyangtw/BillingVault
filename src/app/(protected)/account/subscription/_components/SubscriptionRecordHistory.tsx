import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SubscriptionRecordData } from "@/features/subscriptions/dal/types";
import {
  formatCurrency,
  formatDate,
  getRecordEventLabel,
  getRecordStatusLabel,
} from "./utils";

type SubscriptionRecordHistoryProps = {
  records: SubscriptionRecordData[];
};

export default function SubscriptionRecordHistory({
  records,
}: SubscriptionRecordHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>訂閱紀錄</CardTitle>
        <CardDescription>追蹤方案建立、續訂與方案變更紀錄。</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="bg-muted/40 rounded-3xl border p-5">
            <p className="font-medium">尚無訂閱紀錄</p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              建立訂閱後，續訂與方案變更紀錄會顯示在這裡。
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {records.map((record, index) => (
              <div key={record.id}>
                <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{record.id}</p>
                      <Badge
                        variant="outline"
                        className={getRecordEventBadgeClassName(record.event)}
                      >
                        {getRecordEventLabel(record.event)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {record.productName} · {record.planName} ·{" "}
                      {formatDate(record.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-medium">
                      {formatCurrency(record.amount)}
                    </span>
                    <Badge
                      variant={
                        record.status === "paid" ? "secondary" : "outline"
                      }
                    >
                      {getRecordStatusLabel(record.status)}
                    </Badge>
                  </div>
                </div>
                {index < records.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getRecordEventBadgeClassName(event: SubscriptionRecordData["event"]) {
  const classNames: Record<SubscriptionRecordData["event"], string> = {
    created:
      "border-violet-500/30 bg-violet-500/12 px-2.5 py-1 text-sm font-semibold text-violet-200",
    renewal:
      "border-emerald-500/30 bg-emerald-500/12 px-2.5 py-1 text-sm font-semibold text-emerald-200",
    plan_change:
      "border-sky-500/35 bg-sky-500/15 px-2.5 py-1 text-sm font-semibold text-sky-200",
  };

  return classNames[event];
}
