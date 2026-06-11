"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChangeSubscriptionPlan } from "@/features/subscriptions/queries/useChangeSubscriptionPlan";
import type { BillingCycle } from "@/mocks/plans";
import type {
  PlanOptionData,
  ScheduledSubscriptionChangeData,
  SubscriptionStatus,
} from "@/features/subscriptions/dal/types";
import PlanOption from "./PlanOption";
import {
  getPlanOptionAction,
  getPlanOptionStatusLabel,
} from "./planOptionState";

type PlanChangePanelProps = {
  currentSubscriptionId: string | null;
  currentPlanId: string | null;
  currentSubscriptionStatus: SubscriptionStatus | null;
  currentCycle: BillingCycle | null;
  scheduledChange: ScheduledSubscriptionChangeData | null;
  plans: PlanOptionData[];
};

export default function PlanChangePanel({
  currentSubscriptionId,
  currentPlanId,
  currentSubscriptionStatus,
  currentCycle,
  scheduledChange,
  plans,
}: PlanChangePanelProps) {
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [displayCycle, setDisplayCycle] = useState<BillingCycle>(
    currentCycle ?? "monthly",
  );
  const changePlanMutation = useChangeSubscriptionPlan(currentSubscriptionId);
  const isCanceled = currentSubscriptionStatus === "canceled";
  const selectedDisplayCycle = displayCycle;

  function handleChangePlan(plan: PlanOptionData) {
    const isCurrentSelection =
      plan.id === currentPlanId && selectedDisplayCycle === currentCycle;

    if (!currentSubscriptionId || isCanceled || isCurrentSelection) {
      return;
    }

    if (plan.action === "contact") {
      toast.info("企業方案請聯絡銷售顧問。");
      return;
    }

    setPendingPlanId(plan.id);
    changePlanMutation.mutate(
      {
        subscriptionId: currentSubscriptionId,
        planId: plan.id,
        cycle: selectedDisplayCycle,
      },
      {
        onSuccess: (result) => {
          toast.success(
            result.changeType === "upgrade"
              ? `已升級至 ${plan.name}`
              : `已排程於本期結束後降級至 ${plan.name}`,
          );
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "變更訂閱方案失敗。",
          );
        },
        onSettled: () => {
          setPendingPlanId(null);
        },
      },
    );
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
        {!currentSubscriptionId ? (
          <p className="text-muted-foreground text-sm">
            尚無訂閱方案，請先前往{" "}
            <Link
              href="/checkout"
              className="text-primary underline-offset-4 hover:underline"
            >
              結帳頁面
            </Link>{" "}
            訂閱。
          </p>
        ) : isCanceled ? (
          <p className="text-muted-foreground text-sm">
            請於訂閱到期後再重新訂閱。
          </p>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDisplayCycle("monthly")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedDisplayCycle === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                月繳
              </button>
              <button
                type="button"
                onClick={() => setDisplayCycle("yearly")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedDisplayCycle === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                年繳
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <PlanOption
                  key={plan.id}
                  plan={plan}
                  displayCycle={selectedDisplayCycle}
                  action={getPlanOptionAction({
                    plan,
                    currentPlanId,
                    currentCycle,
                    scheduledChange,
                    selectedDisplayCycle,
                  })}
                  isCurrent={
                    plan.id === currentPlanId &&
                    selectedDisplayCycle === currentCycle
                  }
                  statusLabel={getPlanOptionStatusLabel({
                    plan,
                    currentPlanId,
                    currentCycle,
                    scheduledChange,
                    selectedDisplayCycle,
                  })}
                  isPending={pendingPlanId === plan.id}
                  isDisabled={changePlanMutation.isPending}
                  onChangePlan={handleChangePlan}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
