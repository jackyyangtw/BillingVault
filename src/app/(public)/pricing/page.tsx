import type { Metadata } from "next";
import PricingSection from "./_components/PricingSection";

export const metadata: Metadata = {
  title: "Pricing | SecureCart",
  description:
    "Compare SecureCart subscription plans with monthly and yearly billing options.",
};

export default function PricingPage() {
  return (
    <main className="pt-16">
      <PricingSection />
    </main>
  );
}
