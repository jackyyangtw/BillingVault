import Link from "next/link";
import { MoreHorizontal, PanelLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const mobileLinks = [
  { label: "Overview", href: "/account" },
  { label: "Checkout", href: "/checkout" },
  { label: "Payment", href: "/payment" },
];

export default function ProtectedTopbar() {
  return (
    <header className="border-border/70 bg-background/95 sticky top-0 z-30 flex min-h-14 flex-col border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <PanelLeft className="text-muted-foreground lg:hidden" />
          <div className="bg-primary/10 text-primary hidden size-8 items-center justify-center rounded-lg sm:flex">
            <ShieldCheck />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">SecureCart Console</p>
            <p className="text-muted-foreground hidden truncate text-xs sm:block">
              Billing, payments, subscriptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Visit site</Link>
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="更多操作">
            <MoreHorizontal />
          </Button>
        </div>
      </div>

      <nav className="border-border/70 flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden">
        {mobileLinks.map((link) => (
          <Button key={link.href} variant="ghost" size="sm" asChild>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>
    </header>
  );
}
