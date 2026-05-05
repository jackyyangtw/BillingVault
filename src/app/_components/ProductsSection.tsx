import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  Bell,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const products = [
  {
    icon: ShieldCheck,
    name: "CodeGuard",
    tagline: "依賴套件安全掃描與 CI 風險警告",
    price: "$19",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Activity,
    name: "DeployWatch",
    tagline: "部署監控與版本發布追蹤",
    price: "$15",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    name: "ErrorPulse",
    tagline: "前端錯誤追蹤與 Session 診斷",
    price: "$29",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    name: "MetricFlow",
    tagline: "產品分析與轉換率儀表板",
    price: "$39",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Users,
    name: "TeamVault",
    tagline: "安全團隊工作區與存取控制",
    price: "$49",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Bell,
    name: "AlertGrid",
    tagline: "多通道事件警報與待命排班路由",
    price: "$25",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
];

export default function ProductsSection() {
  return (
    <section id="products" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            產品介紹
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight">
            專為開發者團隊打造的工具
          </h2>
          <p className="text-muted-foreground mt-4">
            一套完整的資安與可觀測性工具，每項產品皆可獨立訂閱。
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Card
                key={product.name}
                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div
                    className={`mb-3 flex size-10 items-center justify-center rounded-lg ${product.bg}`}
                  >
                    <Icon className={`size-5 ${product.color}`} />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {product.name}
                    <span className="text-muted-foreground text-base font-semibold">
                      {product.price}
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
                    <Link href="/pricing">
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
