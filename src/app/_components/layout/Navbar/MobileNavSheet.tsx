"use client";

import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/lib/auth/logout";
import AccountLink from "./AccountLink";

type NavLink = {
  label: string;
  href: string;
};

type MobileNavSheetProps = {
  isAuthenticated: boolean;
  navLinks: readonly NavLink[];
  userName?: string;
};

export default function MobileNavSheet({
  isAuthenticated,
  navLinks,
  userName,
}: MobileNavSheetProps) {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="開啟選單">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>BillingVault</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <nav className="flex flex-col gap-2 px-3">
            {navLinks.map((link) => (
              <SheetClose key={link.label} asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </SheetClose>
            ))}
          </nav>
          <div className="border-border/70 mt-auto flex flex-col gap-2 border-t p-3">
            {isAuthenticated && userName ? (
              <>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm" asChild>
                    <AccountLink userName={userName} />
                  </Button>
                </SheetClose>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut data-icon="inline-start" />
                  登出
                </Button>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="/login">登入</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/pricing">查看方案</Link>
                  </Button>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
