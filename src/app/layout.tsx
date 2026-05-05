import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/tailwind-css/utils";
import Navbar from "./_components/layout/Navbar";
import Footer from "./_components/layout/Footer";
import ThemeProvider from "./_components/layout/ThemeProvider";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureCart — Secure SaaS Subscription Checkout",
  description:
    "SecureCart is a security-focused SaaS subscription checkout demo built with Next.js App Router, featuring pricing plans, mock payment flow, subscription management, billing history, and CSP-hardened frontend architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
