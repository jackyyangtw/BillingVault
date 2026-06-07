import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { listSubscriptionOverview } from "@/features/subscriptions/dal/listSubscriptionOverview";
import { verifySession } from "@/lib/auth/dal";
import CurrentSubscription from "./_components/CurrentSubscription";
import NoCurrentSubscription from "./_components/NoCurrentSubscription";
import PlanChangePanel from "./_components/PlanChangePanel";
import SubscriptionDangerZone from "./_components/SubscriptionDangerZone";
import SubscriptionRecordHistory from "./_components/SubscriptionRecordHistory";

export const metadata: Metadata = {
  title: "訂閱管理 | SecureCart",
  description: "管理 SecureCart 訂閱狀態、方案變更、訂閱紀錄與取消流程。",
};

export default async function SubscriptionPage() {
  const { userId } = await verifySession();
  const subscriptionOverview = await listSubscriptionOverview(userId);
  const { currentSubscription, planOptions, subscriptionRecords } =
    subscriptionOverview;

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
            {currentSubscription ? (
              <CurrentSubscription subscription={currentSubscription} />
            ) : (
              <NoCurrentSubscription />
            )}
            <PlanChangePanel
              currentSubscriptionId={currentSubscription?.id ?? null}
              currentPlanId={currentSubscription?.planId ?? null}
              currentCycle={currentSubscription?.cycle ?? null}
              plans={planOptions}
            />
          </div>

          <aside className="flex flex-col gap-6">
            <SubscriptionRecordHistory records={subscriptionRecords} />
            {currentSubscription &&
              currentSubscription.status !== "canceled" && (
                <SubscriptionDangerZone subscription={currentSubscription} />
              )}
          </aside>
        </div>
      </section>
    </main>
  );
}
