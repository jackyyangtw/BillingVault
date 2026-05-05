import Link from "next/link";
import { ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const trustSignals = ["免信用卡即可開始", "14 天免費試用", "隨時取消"];

const mockStats = [
  { label: "專案數量", value: "5" },
  { label: "下次帳單日", value: "6/1" },
  { label: "已用席位", value: "3 / 5" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40">
      {/* 漸層光暈 */}
      <div
        aria-hidden
        className="bg-primary/10 pointer-events-none absolute -top-40 left-1/2 size-[900px] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-primary/5 pointer-events-none absolute top-0 right-0 size-[500px] translate-x-1/3 rounded-full blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <ShieldCheck className="size-3" />
            以資安為核心的 SaaS 結帳平台
          </Badge>

          <h1 className="text-foreground text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            你的 SaaS 值得擁有
            <br />
            <span className="text-primary">更好的結帳體驗</span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-relaxed">
            SecureCart 提供訂閱方案管理、帳務計費、模擬信用卡 Tokenization
            與稽核紀錄， 讓你專注在功能開發，而不是重複建構結帳流程。
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/pricing">
                免費開始試用
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#products">探索產品</Link>
            </Button>
          </div>

          {/* 信任指標 */}
          <div className="text-muted-foreground mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            {trustSignals.map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="text-primary size-4" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 帳務儀表板預覽卡 */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="border-border bg-card rounded-2xl border p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">目前方案</p>
                <p className="mt-1 text-lg font-semibold">Pro — $29 / 月</p>
              </div>
              <Badge>訂閱中</Badge>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              {mockStats.map((item) => (
                <div key={item.label} className="bg-muted rounded-lg px-3 py-4">
                  <p className="text-xl font-bold">{item.value}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                管理訂閱
              </Button>
              <Button size="sm" className="flex-1">
                升級至 Business
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
