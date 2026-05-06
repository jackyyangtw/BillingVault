import HeroSection from "./_components/HeroSection";
import ProductsSection from "./_components/ProductsSection";
import SecuritySection from "./_components/SecuritySection";
import CheckoutFlowSection from "./_components/CheckoutFlowSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import CtaSection from "./_components/CtaSection";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <ProductsSection />
      <SecuritySection />
      <CheckoutFlowSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
