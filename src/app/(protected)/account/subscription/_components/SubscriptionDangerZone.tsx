import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CurrentSubscriptionData } from "@/features/subscriptions/dal/types";
import { formatDate } from "../_utils/utils";
import CancelSubscriptionDialog from "./CancelSubscriptionDialog";

type SubscriptionDangerZoneProps = {
  subscription: CurrentSubscriptionData;
};

export default function SubscriptionDangerZone({
  subscription,
}: SubscriptionDangerZoneProps) {
  const renewalDateLabel = formatDate(subscription.renewalDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>取消訂閱</CardTitle>
        <CardDescription>取消後仍可使用到 {renewalDateLabel}。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-destructive/10 text-destructive flex gap-3 rounded-3xl border p-4">
          <AlertTriangle className="mt-0.5 shrink-0" />
          <p className="text-sm leading-6">
            取消訂閱會停止下一期續訂，現有專案和帳務紀錄仍會保留。
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <CancelSubscriptionDialog
          subscriptionId={subscription.id}
          renewalDateLabel={renewalDateLabel}
        />
      </CardFooter>
    </Card>
  );
}
