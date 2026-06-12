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
import type {
  CurrentSubscriptionData,
  SubscriptionStatus,
} from "@/features/subscriptions/dal/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

type CurrentSubscriptionProps = {
  subscription: CurrentSubscriptionData;
};

export default function CurrentSubscription({
  subscription,
}: CurrentSubscriptionProps) {
  const isCanceled = subscription.status === "canceled";
  const periodDateLabel = isCanceled ? "可使用至" : "下次續訂日";
  const periodDateDetail = isCanceled
    ? "到期後將停止續訂"
    : `預計收取 ${formatCurrency(subscription.nextInvoiceAmount)}`;
  const statusBadge = getStatusBadge(subscription);
  const scheduledChange = isCanceled ? null : subscription.scheduledChange;
  const scheduledChangeLabel = getScheduledChangeLabel(scheduledChange);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>目前訂閱狀態</CardTitle>
            <CardDescription>
              {isCanceled
                ? `${subscription.productName} 已取消續訂，仍可使用 ${subscription.planName} 方案至 ${formatDate(subscription.renewalDate)}。`
                : `${subscription.productName} 正在使用 ${subscription.planName} 方案。`}
            </CardDescription>
          </div>
          <Badge
            variant={statusBadge.variant}
            className={statusBadge.className}
          >
            {statusBadge.label}
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
            label={periodDateLabel}
            value={formatDate(subscription.renewalDate)}
            detail={
              scheduledChange
                ? `將於 ${formatDate(scheduledChange.effectiveAt)} 改為 ${scheduledChangeLabel}`
                : periodDateDetail
            }
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
            detail="訂閱操作保留稽核紀錄"
          />
        </div>
        {scheduledChange && (
          <div className="bg-muted/40 mt-4 rounded-3xl border p-4">
            <p className="font-medium">已排程降級</p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              目前仍可使用 {scheduledChange.fromPlanName}，將於{" "}
              {formatDate(scheduledChange.effectiveAt)} 起改為{" "}
              {scheduledChangeLabel}。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getScheduledChangeLabel(
  scheduledChange: CurrentSubscriptionData["scheduledChange"],
) {
  if (!scheduledChange) {
    return "";
  }

  const cycleLabel = scheduledChange.toCycle === "monthly" ? "月繳" : "年繳";

  return `${scheduledChange.toPlanName} ${cycleLabel}方案`;
}

function getStatusBadge(subscription: CurrentSubscriptionData) {
  if (subscription.status === "canceled") {
    return {
      label: getSubscriptionStatusLabel(subscription.status),
      variant: "destructive" as const,
      className: undefined,
    };
  }

  if (subscription.isExpiringSoon) {
    return {
      label: "快到期",
      variant: "outline" as const,
      className: "border-orange-500/20 bg-orange-500/10 text-orange-600",
    };
  }

  if (subscription.status === "active" || subscription.status === "trialing") {
    return {
      label: getSubscriptionStatusLabel(subscription.status),
      variant: "outline" as const,
      className: "border-green-500/20 bg-green-500/10 text-green-600",
    };
  }

  return {
    label: getSubscriptionStatusLabel(subscription.status),
    variant: "secondary" as const,
    className: undefined,
  };
}

function getSubscriptionStatusLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    trialing: "試用中",
    active: "訂閱中",
    past_due: "付款逾期",
    canceled: "已取消續訂",
    incomplete: "尚未完成",
  };

  return labels[status];
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
      <div
        aria-hidden="true"
        className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-2xl"
      >
        <Icon />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="truncate text-xl font-semibold">{value}</p>
        <p className="text-muted-foreground text-sm leading-6 break-words">
          {detail}
        </p>
      </div>
    </div>
  );
}
