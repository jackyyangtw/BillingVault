import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import CurrentSubscription from "./_components/CurrentSubscription";
import PlanChangePanel from "./_components/PlanChangePanel";
import SubscriptionDangerZone from "./_components/SubscriptionDangerZone";
import SubscriptionRecordHistory from "./_components/SubscriptionRecordHistory";
import {
  currentSubscription,
  planOptions,
  subscriptionRecords,
} from "./_components/data";

export const metadata: Metadata = {
  title: "Subscriptions | SecureCart",
  description:
    "Manage SecureCart subscription status, plan changes, subscription history, and cancellation.",
};

export default function SubscriptionPage() {
  return (
    <main>
      <section className="border-border/60 border-b py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Subscription Management
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            訂閱管理
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            查看目前方案、訂閱紀錄，並管理升級、降級或取消訂閱流程。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:px-8">
          <div className="flex flex-col gap-6">
            <CurrentSubscription subscription={currentSubscription} />
            <PlanChangePanel
              currentPlanId={currentSubscription.planId}
              plans={planOptions}
            />
          </div>

          <aside className="flex flex-col gap-6">
            <SubscriptionRecordHistory records={subscriptionRecords} />
            <SubscriptionDangerZone subscription={currentSubscription} />
          </aside>
        </div>
      </section>
    </main>
  );
}
