import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaTechBackground from "./CtaTechBackground";

export default function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="shadow-primary/20 relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-2xl">
          <CtaTechBackground />

          <div className="relative">
            <h2 className="text-primary-foreground text-4xl font-bold">
              準備好打造安全的結帳體驗了嗎？
            </h2>
            <p className="text-primary-foreground/80 mx-auto mt-4 max-w-md">
              立即開始 14 天免費試用，無需信用卡，隨時可取消。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/pricing">
                  免費開始試用
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground hover:bg-white/20"
                asChild
              >
                <Link href="/auth/login">登入帳號</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
