import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getCurrentSubscriptionCheckoutState } from "@/features/subscriptions/dal/getCurrentSubscriptionCheckoutState";
import { getCurrentUser } from "@/lib/auth/dal";
import { products } from "@/mocks/products";
import {
  type BillingCycle,
  getSelectableBillingCycle,
  getSelectablePlanId,
} from "@/mocks/plans";
import CheckoutForm from "./_components/CheckoutForm";
import { checkoutPlans } from "./_utils/checkoutPlans";

type CheckoutPageProps = {
  searchParams: Promise<{
    plan?: string;
    product?: string;
    cycle?: string;
  }>;
};

export const metadata: Metadata = {
  title: "訂閱結帳 | SecureCart",
  description:
    "模擬安全的 SaaS 訂閱結帳流程，包含帳務資料、付款方式輸入與訂單確認。",
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const currentSubscription = user
    ? await getCurrentSubscriptionCheckoutState(user.id)
    : null;
  const currentPlanId = currentSubscription?.planId ?? null;
  const currentCycle = currentSubscription?.cycle ?? null;
  const planExists = checkoutPlans.some((plan) => plan.id === params.plan);
  const productExists = products.some(
    (product) => product.id === params.product,
  );
  const targetCycle: BillingCycle =
    params.cycle === "yearly" ? "yearly" : "monthly";
  const targetPlanId = planExists ? params.plan! : "pro";
  const initialPlanId = getSelectablePlanId(targetPlanId, currentPlanId);
  const initialCycle = getSelectableBillingCycle(targetCycle, currentCycle);
  const initialProductIds = [productExists ? params.product! : products[0].id];

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
            initialPlanId={initialPlanId}
            initialProductIds={initialProductIds}
            initialCycle={initialCycle}
            initialCompanyName={user?.name ?? ""}
            initialBillingEmail={user?.email ?? ""}
            currentPlanId={currentPlanId}
            currentCycle={currentCycle}
          />
        </div>
      </section>
    </main>
  );
}
