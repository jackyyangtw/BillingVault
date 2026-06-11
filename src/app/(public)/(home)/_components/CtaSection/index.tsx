import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyLead } from "@/components/ui/typography";
import CtaTechBackground from "./CtaTechBackground";

export default function CtaSection() {
  return (
    <section className="bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="shadow-primary/20 relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-2xl">
          <CtaTechBackground />

          <div className="relative">
            <TypographyH2 className="text-primary-foreground border-0 pb-0 text-4xl font-bold">
              準備好打造安全的結帳體驗了嗎？
            </TypographyH2>
            <TypographyLead className="text-primary-foreground/80 mx-auto mt-4 max-w-md text-base">
              綁定信用卡即可開始使用，隨時可取消無負擔。
            </TypographyLead>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/pricing">
                  查看方案
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
