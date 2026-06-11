import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <main>
      <section className="border-border/60 border-b py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            帳務管理
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            管理本期帳務狀態、付款方式與帳單紀錄。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:px-8">
          <div className="flex flex-col gap-6">
            {/* BillingSummary skeleton */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-muted/40 flex min-h-36 flex-col justify-between rounded-3xl border p-4"
                    >
                      <Skeleton className="h-4 w-20" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* OrderHistory skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* InvoiceHistory skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-5 w-14 rounded-3xl" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* PaymentMethodPanel skeleton */}
          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-9 w-full rounded-3xl" />
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
