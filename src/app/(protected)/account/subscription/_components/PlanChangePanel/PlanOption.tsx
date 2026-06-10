import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  LoaderCircle,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BillingCycle } from "@/mocks/fixtures/plans";
import type { PlanOptionData } from "@/features/subscriptions/dal/types";

const actionIcon = {
  downgrade: ArrowDownRight,
  current: Check,
  upgrade: ArrowUpRight,
  contact: MessageCircle,
};

const actionLabel = {
  downgrade: "降級",
  current: "目前方案",
  upgrade: "升級",
  contact: "聯絡銷售",
};

export type PlanOptionAction = keyof typeof actionLabel;

export type PlanOptionProps = {
  plan: PlanOptionData;
  displayCycle: BillingCycle;
  action: PlanOptionAction;
  isCurrent: boolean;
  statusLabel: string | null;
  isPending: boolean;
  isDisabled: boolean;
  onChangePlan: (plan: PlanOptionData) => void;
};

export default function PlanOption({
  plan,
  displayCycle,
  action,
  isCurrent,
  statusLabel,
  isPending,
  isDisabled,
  onChangePlan,
}: PlanOptionProps) {
  const Icon = actionIcon[action];
  const isButtonDisabled = isCurrent || isDisabled;
  const statusBadgeClassName = getStatusBadgeClassName(statusLabel);

  return (
    <div className="flex min-h-44 flex-col justify-between rounded-3xl border p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{plan.name}</p>
            <div className="flex items-baseline gap-1">
              <span
                className={
                  action === "contact"
                    ? "text-xl font-bold"
                    : "text-3xl font-bold"
                }
              >
                {displayCycle === "monthly"
                  ? plan.priceMonthly
                  : plan.priceYearly}
              </span>
              {action !== "contact" && (
                <span className="text-muted-foreground text-sm">
                  /{displayCycle === "monthly" ? "月" : "年"}
                </span>
              )}
            </div>
          </div>
          {statusLabel && (
            <Badge variant="outline" className={statusBadgeClassName}>
              {statusLabel}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-6">{plan.fit}</p>
      </div>
      <Button
        variant={isCurrent ? "secondary" : "outline"}
        className="mt-5 w-full"
        disabled={isButtonDisabled}
        onClick={() => onChangePlan(plan)}
      >
        {isPending ? (
          <LoaderCircle data-icon="inline-start" className="animate-spin" />
        ) : (
          <Icon data-icon="inline-start" />
        )}
        {actionLabel[action]}
      </Button>
    </div>
  );
}

function getStatusBadgeClassName(statusLabel: string | null) {
  if (statusLabel === "使用中") {
    return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (statusLabel === "目標方案") {
    return "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return undefined;
}
