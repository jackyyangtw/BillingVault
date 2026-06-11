import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TypographyH2,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";

const testimonials = [
  {
    quote:
      "導入 SecureCart 後，結帳放棄率下降了 38%。訂閱流程穩定到幾乎不需要維護。",
    author: "Priya K.",
    role: "CTO，StackLayer",
    rating: 5,
  },
  {
    quote:
      "終於有一個 SaaS 計費層認真對待資安問題。CSP 實作和 Cookie 處理方式讓我非常滿意。",
    author: "Marcus D.",
    role: "技術負責人，Relay.io",
    rating: 5,
  },
  {
    quote:
      "我們在一個週末就從 Stripe 託管頁面遷移到 SecureCart。開發體驗好到不可思議。",
    author: "Ana Torres",
    role: "創辦人，Codeflow",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <TypographyH2 className="border-0 pb-0 text-4xl font-bold">
            深受工程團隊信賴
          </TypographyH2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.author} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <TypographyP className="text-foreground flex-1 text-sm leading-relaxed [&:not(:first-child)]:mt-0">
                  &ldquo;{t.quote}&rdquo;
                </TypographyP>
                <div>
                  <TypographySmall>{t.author}</TypographySmall>
                  <TypographyMuted className="text-xs">
                    {t.role}
                  </TypographyMuted>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
