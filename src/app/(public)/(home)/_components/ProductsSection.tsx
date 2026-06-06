import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH2, TypographyLead } from "@/components/ui/typography";
import { formatTwdAmount } from "@/lib/currency";
import { cn } from "@/lib/tailwind-css/utils";
import { products, type Product } from "@/mocks/fixtures/products";

const productIcons: Record<Product["id"], typeof ShieldCheck> = {
  codeguard: ShieldCheck,
  deploywatch: Activity,
  errorpulse: Zap,
  metricflow: BarChart3,
  teamvault: Users,
  alertgrid: Bell,
};

const accentClasses: Record<Product["accent"], { icon: string; bg: string }> = {
  primary: { icon: "text-primary", bg: "bg-primary/10" },
  emerald: {
    icon: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  violet: {
    icon: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  rose: {
    icon: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
};

export default function ProductsSection() {
  return (
    <section id="products" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            產品介紹
          </Badge>
          <TypographyH2 className="border-0 pb-0 text-4xl font-bold">
            專為開發者團隊打造的工具
          </TypographyH2>
          <TypographyLead className="mt-4 text-base">
            一套完整的資安與可觀測性工具，每項產品皆可獨立訂閱。
          </TypographyLead>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const Icon = productIcons[product.id];
            const accent = accentClasses[product.accent];

            return (
              <Card
                key={product.id}
                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div
                    className={cn(
                      "mb-3 flex size-10 items-center justify-center rounded-lg",
                      accent.bg,
                    )}
                  >
                    <Icon className={cn("size-5", accent.icon)} />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {product.name}
                    <span className="text-muted-foreground text-base font-semibold">
                      {formatTwdAmount(product.price)}
                      <span className="text-xs font-normal">/月</span>
                    </span>
                  </CardTitle>
                  <CardDescription>{product.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/product/${product.id}`}>
                      了解更多
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
