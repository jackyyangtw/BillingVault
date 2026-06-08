import { Badge } from "@/components/ui/badge";
import { TypographyH2, TypographyLead } from "@/components/ui/typography";
import PricingPlans from "./PricingPlans";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            定價方案
          </Badge>
          <TypographyH2 className="border-0 pb-0 text-4xl font-bold">
            簡單透明的定價
          </TypographyH2>
          <TypographyLead className="mt-4 text-base">
            隨需擴展，無隱藏費用，無意外超額收費。
          </TypographyLead>
        </div>

        <PricingPlans />
      </div>
    </section>
  );
}
