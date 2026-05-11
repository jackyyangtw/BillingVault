import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { products } from "@/mocks/fixtures/products";
import { type BillingCycle, plans } from "@/mocks/fixtures/plans";
import CheckoutForm from "./_components/CheckoutForm";

type CheckoutPageProps = {
  searchParams: Promise<{
    plan?: string;
    product?: string;
    cycle?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Checkout | SecureCart",
  description:
    "Simulate a secure SaaS subscription checkout flow with billing details and payment method entry.",
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const planExists = plans.some((plan) => plan.id === params.plan);
  const productExists = products.some(
    (product) => product.id === params.product,
  );
  const cycle: BillingCycle = params.cycle === "yearly" ? "yearly" : "monthly";

  return (
    <main>
      <section className="border-border/60 border-b py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Secure Checkout
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            模擬 SaaS 訂閱結帳流程
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            完成第二階段的方案選擇、帳務資訊、付款方式、訂單確認與結帳結果。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <CheckoutForm
            initialPlanId={planExists ? params.plan! : "pro"}
            initialProductId={productExists ? params.product! : products[0].id}
            initialCycle={cycle}
          />
        </div>
      </section>
    </main>
  );
}
