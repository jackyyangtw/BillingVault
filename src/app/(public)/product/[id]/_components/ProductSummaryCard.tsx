import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatTwdAmount } from "@/lib/currency";
import type { Product } from "@/mocks/fixtures/products";

type ProductSummaryCardProps = {
  product: Product;
};

export default function ProductSummaryCard({
  product,
}: ProductSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>訂閱摘要</CardTitle>
        <CardDescription>{product.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div>
          <p className="text-muted-foreground text-sm">起始價格</p>
          <p className="mt-1 text-4xl font-bold">
            {formatTwdAmount(product.price)}
            <span className="text-muted-foreground text-sm font-normal">
              /月
            </span>
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          {product.highlights.map((highlight) => (
            <div key={highlight} className="flex items-center gap-2">
              <CheckCircle2 className="text-primary size-4 shrink-0" />
              <span className="text-sm">{highlight}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
