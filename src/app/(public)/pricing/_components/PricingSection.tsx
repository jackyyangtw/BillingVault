import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PricingPlans from "./PricingPlans";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            定價方案
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight">簡單透明的定價</h2>
          <p className="text-muted-foreground mt-4">
            免費起步，隨需擴展。無隱藏費用，無意外超額收費。
          </p>
        </div>

        <PricingPlans />

        <p className="text-muted-foreground mt-10 text-center text-sm">
          需要客製化方案？{" "}
          <Link
            href="/checkout?plan=enterprise"
            className="text-primary underline-offset-4 hover:underline"
          >
            洽詢 Enterprise 企業版 →
          </Link>
        </p>
      </div>
    </section>
  );
}
