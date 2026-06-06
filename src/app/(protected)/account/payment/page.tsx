import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import AddPaymentMethodCard from "./_components/AddPaymentMethodCard";
import PaymentMethodList from "./_components/PaymentMethodList";

export const metadata: Metadata = {
  title: "付款方式 | SecureCart",
  description: "管理 SecureCart 付款方式，並準備接上 TapPay 多卡扣款整合。",
};

export default function PaymentPage() {
  return (
    <main>
      <section className="border-border/60 border-b py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Payment Methods
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            付款方式管理
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            管理預設扣款卡、備援卡與過期卡片，之後可在此接上 TapPay tokenization
            與多卡綁定流程。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:px-8">
          <PaymentMethodList />
          <aside className="flex flex-col gap-6">
            <AddPaymentMethodCard />
          </aside>
        </div>
      </section>
    </main>
  );
}
