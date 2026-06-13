import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/tailwind-css/utils";
import { headers } from "next/headers";
import ThemeProvider from "@/providers/ThemeProvider";
import { getCurrentUser } from "@/lib/auth/dal";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { LOCALE } from "@/settings/locale";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-app-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BillingVault — 安全 SaaS 訂閱結帳",
  description:
    "BillingVault 是以安全性為核心的 SaaS 訂閱結帳範例，使用 Next.js App Router 建構，展示定價方案、模擬付款流程、訂閱管理、帳務紀錄與 CSP 強化前端架構。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang={LOCALE}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          <AuthProvider user={user}>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
