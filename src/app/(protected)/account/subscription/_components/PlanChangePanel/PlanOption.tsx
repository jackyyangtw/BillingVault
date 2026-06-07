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

export type PlanOptionProps = {
  plan: PlanOptionData;
  displayCycle: BillingCycle;
  isCurrent: boolean;
  isPending: boolean;
  isDisabled: boolean;
  onChangePlan: (plan: PlanOptionData) => void;
};

export default function PlanOption({
  plan,
  displayCycle,
  isCurrent,
  isPending,
  isDisabled,
  onChangePlan,
}: PlanOptionProps) {
  const Icon = actionIcon[plan.action];
  const isButtonDisabled = isCurrent || isDisabled;

  return (
    <div className="flex min-h-44 flex-col justify-between rounded-3xl border p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{plan.name}</p>
            <div className="flex items-baseline gap-1">
              <span
                className={
                  plan.action === "contact"
                    ? "text-xl font-bold"
                    : "text-3xl font-bold"
                }
              >
                {displayCycle === "monthly"
                  ? plan.priceMonthly
                  : plan.priceYearly}
              </span>
              {plan.action !== "contact" && (
                <span className="text-muted-foreground text-sm">
                  /{displayCycle === "monthly" ? "月" : "年"}
                </span>
              )}
            </div>
          </div>
          {isCurrent && <Badge variant="secondary">使用中</Badge>}
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
        {actionLabel[plan.action]}
      </Button>
    </div>
  );
}
