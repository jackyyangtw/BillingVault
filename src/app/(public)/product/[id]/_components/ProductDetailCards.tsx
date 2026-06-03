import { CheckCircle2, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/mocks/fixtures/products";

type ProductDetailCardsProps = {
  product: Product;
};

export default function ProductDetailCards({
  product,
}: ProductDetailCardsProps) {
  const { useCases: productUseCases, securityNotes: productSecurityNotes } =
    product;

  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>適合情境</CardTitle>
            <CardDescription>
              從產品、工程到資安團隊都能放進日常工作流。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {productUseCases.map((useCase) => (
                <li key={useCase} className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-4 shrink-0" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>資安設計重點</CardTitle>
            <CardDescription>
              詳細頁保留 SecureCart 的核心展示方向：安全流程與可維護架構。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {productSecurityNotes.map((note) => (
                <li key={note} className="flex items-center gap-2">
                  <ShieldCheck className="text-primary size-4 shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
