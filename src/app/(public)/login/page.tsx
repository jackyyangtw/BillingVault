import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isSafeCallbackUrl } from "@/proxy/isSafeCallbackUrl";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "Login | SecureCart",
  description: "Sign in to SecureCart and continue your checkout flow.",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

function getCallbackUrl(value: string | string[] | undefined): string {
  const callbackUrl = Array.isArray(value) ? value[0] : value;
  if (!callbackUrl) return "";
  return isSafeCallbackUrl(callbackUrl) ? callbackUrl : "";
}

const trustItems = [
  {
    icon: LockKeyhole,
    title: "HttpOnly Session",
    description: "Token 僅由伺服器寫入 cookie，前端不接觸敏感資訊。",
  },
  {
    icon: ShieldCheck,
    title: "Route Guard",
    description: "受保護頁面會保留 callbackUrl，登入後回到原流程。",
  },
  {
    icon: Sparkles,
    title: "Mock Ready",
    description: "後端 API 尚未接上時，也能先完成端到端體驗。",
  },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = getCallbackUrl(params.callbackUrl);

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
              這個登入流程使用 Server Action 驗證帳密，成功後建立 HttpOnly
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
