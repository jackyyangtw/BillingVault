import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlanOptionData } from "./types";

type PlanChangePanelProps = {
  currentPlanId: string;
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
  currentPlanId,
  plans,
}: PlanChangePanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>升級 / 降級方案</CardTitle>
        <CardDescription>
          以目前 Pro 方案為基準，模擬 SaaS 帳務常見的方案切換入口。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <PlanOption
              key={plan.id}
              plan={plan}
              isCurrent={plan.id === currentPlanId}
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
};

function PlanOption({ plan, isCurrent }: PlanOptionProps) {
  const Icon = actionIcon[plan.action];

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
        disabled={isCurrent}
      >
        <Icon data-icon="inline-start" />
        {actionLabel[plan.action]}
      </Button>
    </div>
  );
}
