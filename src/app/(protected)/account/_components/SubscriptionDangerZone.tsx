import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CurrentSubscriptionData } from "./types";
import { formatDate } from "./utils";

type SubscriptionDangerZoneProps = {
  subscription: CurrentSubscriptionData;
};

export default function SubscriptionDangerZone({
  subscription,
}: SubscriptionDangerZoneProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>取消訂閱</CardTitle>
        <CardDescription>
          取消後仍可使用到 {formatDate(subscription.renewalDate)}。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-destructive/10 text-destructive flex gap-3 rounded-3xl border p-4">
          <AlertTriangle className="mt-0.5 shrink-0" />
          <p className="text-sm leading-6">
            這裡會接上確認彈窗與取消訂閱 API，避免誤觸造成訂閱中斷。
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="w-full">
          取消訂閱
        </Button>
      </CardFooter>
    </Card>
  );
}
