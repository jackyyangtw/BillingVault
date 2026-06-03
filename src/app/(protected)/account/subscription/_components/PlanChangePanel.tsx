"use client";

import { useState, useTransition } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  LoaderCircle,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { changeSubscriptionPlanAction } from "@/features/subscriptions/actions/changeSubscriptionPlan";
import type { PlanOptionData } from "@/features/subscriptions/dal/types";

type PlanChangePanelProps = {
  currentSubscriptionId: string | null;
  currentPlanId: string | null;
  plans: PlanOptionData[];
};

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

export default function PlanChangePanel({
  currentSubscriptionId,
  currentPlanId,
  plans,
}: PlanChangePanelProps) {
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChangePlan(plan: PlanOptionData) {
    if (!currentSubscriptionId || plan.action === "current") {
      return;
    }

    if (plan.action === "contact") {
      toast.info("企業方案請聯絡銷售顧問。");
      return;
    }

    setPendingPlanId(plan.id);
    startTransition(async () => {
      try {
        const result = await changeSubscriptionPlanAction({
          subscriptionId: currentSubscriptionId,
          planId: plan.id,
        });
        toast.success(
          result.changeType === "upgrade"
            ? `已升級至 ${plan.name}`
            : `已排程於本期結束後降級至 ${plan.name}`,
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "變更訂閱方案失敗。",
        );
      } finally {
        setPendingPlanId(null);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>升級 / 降級方案</CardTitle>
        <CardDescription>
          升級會立即生效並補收本期差額，降級會排程於本期結束後生效。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <PlanOption
              key={plan.id}
              plan={plan}
              isCurrent={plan.id === currentPlanId}
              isPending={pendingPlanId === plan.id}
              isDisabled={!currentSubscriptionId || isPending}
              onChangePlan={handleChangePlan}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type PlanOptionProps = {
  plan: PlanOptionData;
  isCurrent: boolean;
  isPending: boolean;
  isDisabled: boolean;
  onChangePlan: (plan: PlanOptionData) => void;
};

function PlanOption({
  plan,
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
            <p className="text-muted-foreground text-sm">{plan.price}</p>
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
