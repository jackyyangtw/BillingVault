import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionLoading() {
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
            {/* CurrentSubscription skeleton */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex min-h-28 gap-4 rounded-3xl border p-4"
                    >
                      <Skeleton className="size-10 shrink-0 rounded-2xl" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PlanChangePanel skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-52" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex min-h-44 flex-col justify-between rounded-3xl border p-4"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <Skeleton className="h-9 w-full rounded-3xl" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="flex flex-col gap-6">
            {/* SubscriptionRecordHistory skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-44" />
              </CardHeader>
              <CardContent className="flex flex-col">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* SubscriptionDangerZone skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full rounded-3xl" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full rounded-3xl" />
              </CardFooter>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
