import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { listBillingOverview } from "@/features/billing/dal/listBillingOverview";
import { verifySession } from "@/lib/auth/dal";
import { getPrimaryPaymentMethod } from "@/mocks/fixtures/payment-methods";
import BillingSummary from "./_components/BillingSummary";
import InvoiceHistory from "./_components/InvoiceHistory";
import OrderHistory from "./_components/OrderHistory";
import PaymentMethodPanel from "./_components/PaymentMethodPanel";

export const metadata: Metadata = {
  title: "Billing | SecureCart",
  description:
    "Manage SecureCart billing overview, payment methods, and invoice history.",
};

export default async function AccountPage() {
  const { userId } = await verifySession();
  const billingOverview = await listBillingOverview(userId);
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
            管理本期帳務狀態、付款方式與帳單紀錄。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:px-8">
          <div className="flex flex-col gap-6">
            <BillingSummary summary={billingOverview.summary} />
            <OrderHistory orders={billingOverview.orders} />
            <InvoiceHistory invoices={billingOverview.invoices} />
          </div>

          <aside className="flex flex-col gap-6">
            {primaryPaymentMethod && (
              <PaymentMethodPanel paymentMethod={primaryPaymentMethod} />
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
