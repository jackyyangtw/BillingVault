"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { changeSubscriptionPlanAction } from "@/features/subscriptions/actions/changeSubscriptionPlan";
import type { BillingCycle } from "@/mocks/fixtures/plans";
import type { PlanOptionData } from "@/features/subscriptions/dal/types";
import PlanOption from "./PlanOption";

type PlanChangePanelProps = {
  currentSubscriptionId: string | null;
  currentPlanId: string | null;
  currentCycle: BillingCycle | null;
  plans: PlanOptionData[];
};

export default function PlanChangePanel({
  currentSubscriptionId,
  currentPlanId,
  currentCycle,
  plans,
}: PlanChangePanelProps) {
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [displayCycle, setDisplayCycle] = useState<BillingCycle>(
    currentCycle ?? "monthly",
  );

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
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDisplayCycle("monthly")}
                disabled={currentCycle === "yearly"}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  displayCycle === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                月繳
              </button>
              <button
                type="button"
                onClick={() => setDisplayCycle("yearly")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  displayCycle === "yearly"
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
                  displayCycle={displayCycle}
                  isCurrent={plan.id === currentPlanId}
                  isPending={pendingPlanId === plan.id}
                  isDisabled={isPending}
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
