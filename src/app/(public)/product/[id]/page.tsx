import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, products } from "@/mocks/fixtures/products";
import ProductDetailCards from "./_components/ProductDetailCards";
import ProductHero from "./_components/ProductHero";
import ProductSummaryCard from "./_components/ProductSummaryCard";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "找不到產品 | SecureCart",
    };
  }

  return {
    title: `${product.name} | SecureCart`,
    description: product.summary,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="pt-24">
      <section className="border-border/60 border-b py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <ProductHero product={product} />
            <ProductSummaryCard product={product} />
          </div>
        </div>
      </section>

      <ProductDetailCards product={product} />
    </main>
  );
}
