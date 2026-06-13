"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/tailwind-css/utils";
import type { UserProfile } from "@/lib/auth/types";
import {
  isActiveProtectedLink,
  protectedPrimaryLinks,
} from "./protectedNavigation";
import ProtectedSidebarUserMenu from "./ProtectedSidebarUserMenu";

type ProtectedMobileNavSheetProps = {
  user: UserProfile | null;
};

export default function ProtectedMobileNavSheet({
  user,
}: ProtectedMobileNavSheetProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="開啟導覽選單"
        >
          <PanelLeft />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>BillingVault Console</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <nav className="flex flex-col gap-1 px-3">
            {protectedPrimaryLinks.map((link) => {
              const Icon = link.icon;
              const active = isActiveProtectedLink(pathname, link.href);

              return (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-muted-foreground hover:bg-muted hover:text-foreground flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                      active && "bg-muted text-foreground",
                    )}
                  >
                    <Icon />
                    <span className="truncate">{link.label}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
          <div className="border-border/70 mt-auto border-t p-3">
            <ProtectedSidebarUserMenu user={user} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
