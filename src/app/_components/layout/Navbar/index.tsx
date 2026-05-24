"use client";

import Link from "next/link";
import { CircleUserRound, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { logoutAction } from "@/actions/logout";
import ThemeToggle from "../ThemeToggle";
import MobileNavSheet from "./MobileNavSheet";

const navLinks = [
  { label: "產品", href: "/#products" },
  { label: "定價", href: "/pricing" },
  { label: "資安", href: "/#security" },
  { label: "文件", href: "#" },
];

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = user !== null;

  const handleLogout = async () => {
    await logoutAction();
  };

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
        {/* PC menu */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Button variant="ghost" size="sm" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <AccountLink userName={user.name} />
              </Button>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut data-icon="inline-start" />
                登出
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">登入</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/pricing">免費開始</Link>
              </Button>
            </>
          )}
        </div>
        {/* mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileNavSheet
            isAuthenticated={isAuthenticated}
            navLinks={navLinks}
            userName={user?.name}
          />
        </div>
      </nav>
    </header>
  );
}

type AccountLinkProps = {
  userName: string;
};

function AccountLink({ userName }: AccountLinkProps) {
  return (
    <Link
      href="/account"
      className="flex max-w-36 min-w-0 items-center gap-1.5"
    >
      <CircleUserRound data-icon="inline-start" />
      <span className="truncate">{userName}</span>
    </Link>
  );
}
