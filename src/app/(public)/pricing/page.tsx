import type { Metadata } from "next";
import PricingSection from "./_components/PricingSection";

export const metadata: Metadata = {
  title: "定價方案 | SecureCart",
  description: "比較 SecureCart 訂閱方案，選擇月繳或年繳付款週期。",
};

export default function PricingPage() {
  return (
    <main className="pt-16">
      <PricingSection />
    </main>
  );
}
