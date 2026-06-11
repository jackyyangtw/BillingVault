import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/tailwind-css/utils";
import type { Product } from "@/mocks/products";

type ProductHeroProps = {
  product: Product;
};

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

export default function ProductHero({ product }: ProductHeroProps) {
  const Icon = productIcons[product.id];
  const accent = accentClasses[product.accent];

  return (
    <div>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/#products">
          <ArrowLeft data-icon="inline-start" />
          返回產品列表
        </Link>
      </Button>

      <div className="mt-10">
        <div
          className={cn(
            "mb-6 flex size-14 items-center justify-center rounded-2xl",
            accent.bg,
          )}
        >
          <Icon className={cn("size-7", accent.icon)} />
        </div>
        <Badge variant="secondary" className="mb-4">
          SaaS 產品詳細
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
          {product.summary}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href={`/checkout?product=${product.id}&plan=pro`}>
              立即訂閱
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/pricing">比較方案</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
