import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TypographyH2,
  TypographyLead,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";

const steps = [
  { step: "01", label: "選擇方案", desc: "選擇 Starter、Pro 或 Business" },
  { step: "02", label: "帳務資訊", desc: "填寫帳戶基本資料" },
  { step: "03", label: "付款方式", desc: "模擬信用卡 Tokenization" },
  { step: "04", label: "確認訂單", desc: "確認方案與金額" },
  { step: "05", label: "完成訂閱", desc: "即時確認通知" },
];

export default function CheckoutFlowSection() {
  return (
    <section className="bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <TypographyH2 className="border-0 pb-0 text-4xl font-bold">
            從選擇方案到啟用訂閱
          </TypographyH2>
          <TypographyLead className="mt-4 text-base">
            五個步驟的簡潔結帳流程，在提升轉換率的同時確保使用者資料安全。
          </TypographyLead>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-5">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="border-primary bg-primary/10 relative flex size-14 items-center justify-center rounded-full border-2">
                  <span className="text-primary text-sm font-bold">
                    {item.step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="bg-border absolute top-1/2 left-full hidden h-0.5 w-full -translate-y-1/2 md:block" />
                  )}
                </div>
                <TypographySmall className="mt-3">{item.label}</TypographySmall>
                <TypographyMuted className="mt-1 text-xs">
                  {item.desc}
                </TypographyMuted>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Button size="lg" asChild>
            <Link href="/checkout">
              體驗結帳流程
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
