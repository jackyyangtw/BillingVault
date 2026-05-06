"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/tailwind-css/utils";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "產品", href: "/#products" },
  { label: "定價", href: "/pricing" },
  { label: "資安", href: "/#security" },
  { label: "文件", href: "#" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/50 bg-background/55 fixed inset-x-0 top-0 z-50 border-b shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="text-foreground flex items-center gap-2 font-semibold"
        >
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <ShieldCheck className="size-5" />
          </span>
          <span className="text-lg tracking-tight">SecureCart</span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">登入</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/pricing">免費開始</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="開啟選單">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "border-border/50 bg-background/70 flex flex-col gap-4 border-t px-6 pt-4 pb-6 shadow-sm backdrop-blur-xl transition-all duration-300 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-muted-foreground hover:text-foreground text-sm"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className="flex flex-col gap-2 pt-2">
          <Button variant="outline" asChild>
            <Link href="/auth/login">登入</Link>
          </Button>
          <Button asChild>
            <Link href="/pricing">免費開始試用</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
