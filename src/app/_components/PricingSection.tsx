import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/月",
    description: "適合個人開發者",
    features: ["1 個專案", "基本分析報表", "Email 支援", "5 GB 儲存空間"],
    highlight: false,
    cta: "免費開始試用",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/月",
    description: "適合快速成長的小團隊",
    features: [
      "5 個專案",
      "進階分析報表",
      "Webhook 警告通知",
      "50 GB 儲存空間",
      "優先技術支援",
    ],
    highlight: true,
    badge: "最多人選擇",
    cta: "立即開始",
  },
  {
    name: "Business",
    price: "$99",
    period: "/月",
    description: "適合規模化企業團隊",
    features: [
      "無限專案",
      "團隊角色與權限管理",
      "稽核紀錄",
      "500 GB 儲存空間",
      "專屬技術支援",
      "SSO 單一登入",
    ],
    highlight: false,
    cta: "聯繫業務",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            定價方案
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight">簡單透明的定價</h2>
          <p className="text-muted-foreground mt-4">
            免費起步，隨需擴展。無隱藏費用，無意外超額收費。
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-primary/10 shadow-xl"
                  : "border-border bg-card"
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}

              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <ul className="flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={plan.highlight ? "default" : "outline"}
                asChild
              >
                <Link href="/pricing">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-10 text-center text-sm">
          需要客製化方案？{" "}
          <Link
            href="#"
            className="text-primary underline-offset-4 hover:underline"
          >
            洽詢 Enterprise 企業版 →
          </Link>
        </p>
      </div>
    </section>
  );
}
