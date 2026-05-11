import type { ComponentType } from "react";
import { CalendarClock, PackageCheck, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CurrentSubscriptionData } from "./types";
import {
  formatCurrency,
  formatDate,
  getSubscriptionStatusLabel,
} from "./utils";

type CurrentSubscriptionProps = {
  subscription: CurrentSubscriptionData;
};

export default function CurrentSubscription({
  subscription,
}: CurrentSubscriptionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>目前訂閱狀態</CardTitle>
            <CardDescription>
              {subscription.productName} 正在使用 {subscription.planName} 方案。
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {getSubscriptionStatusLabel(subscription.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <SubscriptionMetric
            icon={PackageCheck}
            label="目前方案"
            value={subscription.planName}
            detail={subscription.cycle === "monthly" ? "月繳方案" : "年繳方案"}
          />
          <SubscriptionMetric
            icon={CalendarClock}
            label="下次續訂日"
            value={formatDate(subscription.renewalDate)}
            detail={`預計收取 ${formatCurrency(subscription.nextInvoiceAmount)}`}
          />
          <SubscriptionMetric
            icon={Users}
            label="團隊用量"
            value={`${subscription.seats} 席`}
            detail="包含在目前訂閱額度內"
          />
          <SubscriptionMetric
            icon={ShieldCheck}
            label="安全狀態"
            value="已啟用"
            detail="帳務操作保留稽核紀錄"
          />
        </div>
      </CardContent>
    </Card>
  );
}

type SubscriptionMetricProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
};

function SubscriptionMetric({
  icon: Icon,
  label,
  value,
  detail,
}: SubscriptionMetricProps) {
  return (
    <div className="flex min-h-28 gap-4 rounded-3xl border p-4">
      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-2xl">
        <Icon />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="truncate text-xl font-semibold">{value}</p>
        <p className="text-muted-foreground text-sm leading-6">{detail}</p>
      </div>
    </div>
  );
}
