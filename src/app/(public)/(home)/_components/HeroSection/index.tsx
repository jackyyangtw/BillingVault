import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import HeroGridBackground from "./HeroGridBackground";

const trustSignals = ["綁定信用卡即可開始", "隨時取消無負擔"];

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-32 pb-24 lg:pt-40">
      <HeroGridBackground />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <TypographyH1 className="text-foreground text-5xl leading-tight font-bold sm:text-6xl lg:text-7xl">
            你的 SaaS 值得擁有
            <br />
            <span className="text-primary">更好的結帳體驗</span>
          </TypographyH1>

          <TypographyMuted className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">
            SecureCart 提供訂閱方案管理、帳務計費、模擬信用卡 Tokenization
            與稽核紀錄， 讓你專注在功能開發，而不是重複建構結帳流程。
          </TypographyMuted>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/pricing">
                查看方案
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
      </div>
    </section>
  );
}
