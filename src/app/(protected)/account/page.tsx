import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import BillingSummary from "./_components/BillingSummary";
import CurrentSubscription from "./_components/CurrentSubscription";
import InvoiceHistory from "./_components/InvoiceHistory";
import PaymentMethodPanel from "./_components/PaymentMethodPanel";
import PlanChangePanel from "./_components/PlanChangePanel";
import SubscriptionDangerZone from "./_components/SubscriptionDangerZone";
import { getPrimaryPaymentMethod } from "@/mocks/fixtures/payment-methods";
import {
  billingSummary,
  currentSubscription,
  invoices,
  planOptions,
} from "./_components/data";

export const metadata: Metadata = {
  title: "Billing | SecureCart",
  description:
    "Manage SecureCart subscription status, payment methods, invoice history, and plan changes.",
};

export default function AccountPage() {
  const primaryPaymentMethod = getPrimaryPaymentMethod();

  return (
    <main>
      <section className="border-border/60 border-b py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Account Billing
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            帳務管理
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            管理目前訂閱、付款方式、帳單紀錄，以及升級、降級或取消方案。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:px-8">
          <div className="flex flex-col gap-6">
            <BillingSummary summary={billingSummary} />
            <CurrentSubscription subscription={currentSubscription} />
            <PlanChangePanel
              currentPlanId={currentSubscription.planId}
              plans={planOptions}
            />
          </div>

          <aside className="flex flex-col gap-6">
            {primaryPaymentMethod && (
              <PaymentMethodPanel paymentMethod={primaryPaymentMethod} />
            )}
            <InvoiceHistory invoices={invoices} />
            <SubscriptionDangerZone subscription={currentSubscription} />
          </aside>
        </div>
      </section>
    </main>
  );
}
