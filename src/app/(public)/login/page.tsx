import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "登入 | SecureCart",
  description: "登入 SecureCart，繼續完成你的訂閱結帳流程。",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

const trustItems = [
  {
    icon: LockKeyhole,
    title: "Supabase Session",
    description: "由 Supabase Auth 管理 session cookie，前端不保存敏感 token。",
  },
  {
    icon: ShieldCheck,
    title: "Route Guard",
    description: "受保護頁面會保留 callbackUrl，登入後回到原流程。",
  },
  {
    icon: Sparkles,
    title: "Email Only",
    description: "MVP 僅支援一組 Email 測試帳號，暫不開放註冊與 OAuth。",
  },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "";

  return (
    <main className="bg-muted/30 min-h-screen pt-24">
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_440px] lg:px-8">
        <div className="flex flex-col gap-8">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              回首頁
            </Link>
          </Button>

          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-5 gap-1.5">
              <ShieldCheck className="size-3" />
              SecureCart Auth
            </Badge>
            <h1 className="text-foreground text-4xl leading-tight font-bold text-balance sm:text-5xl">
              登入後，繼續完成你的安全訂閱結帳。
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-8">
              這個登入流程使用 Server Action 呼叫 Supabase Auth，成功後建立
              session，並回到你原本準備前往的受保護頁面。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="bg-background/80 rounded-lg border p-4 shadow-sm"
              >
                <item.icon className="text-primary size-5" />
                <h2 className="mt-4 font-semibold">{item.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <LoginForm callbackUrl={callbackUrl} />
      </section>
    </main>
  );
}
