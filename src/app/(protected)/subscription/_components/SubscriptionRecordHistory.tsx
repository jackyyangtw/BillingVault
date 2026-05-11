import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SubscriptionRecordData } from "./types";
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
        <div className="flex flex-col">
          {records.map((record, index) => (
            <div key={record.id}>
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{record.id}</p>
                    <Badge variant="outline">
                      {getRecordEventLabel(record.event)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {record.planName} · {formatDate(record.date)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="font-medium">
                    {formatCurrency(record.amount)}
                  </span>
                  <Badge
                    variant={record.status === "paid" ? "secondary" : "outline"}
                  >
                    {getRecordStatusLabel(record.status)}
                  </Badge>
                </div>
              </div>
              {index < records.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
