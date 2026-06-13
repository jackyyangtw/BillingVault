import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyLarge,
  TypographyLead,
} from "@/components/ui/typography";

export default function NotFound() {
  return (
    <main className="bg-background flex min-h-[calc(100vh-8rem)] items-center px-6 py-36 lg:px-8">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="bg-muted text-muted-foreground flex size-24 items-center justify-center rounded-full">
          <MapPinOff aria-hidden />
        </div>

        <TypographyLarge className="text-primary mt-10 text-7xl leading-none font-bold tracking-tight sm:text-8xl">
          404
        </TypographyLarge>
        <TypographyH1 className="text-foreground mt-6 text-5xl leading-tight font-bold sm:text-6xl lg:text-7xl">
          找不到這個頁面
        </TypographyH1>
        <TypographyLead className="mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
          這個連結可能已經移動、失效，或目前還沒有開放。你可以回到首頁，
          或前往定價頁繼續探索 BillingVault。
        </TypographyLead>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              回到首頁
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">查看定價</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
