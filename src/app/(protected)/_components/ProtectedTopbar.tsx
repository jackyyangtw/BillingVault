import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/auth/types";
import ProtectedMobileNavSheet from "./ProtectedMobileNavSheet";

type ProtectedTopbarProps = {
  user: UserProfile | null;
};

export default function ProtectedTopbar({ user }: ProtectedTopbarProps) {
  return (
    <header className="border-border/70 bg-background/95 sticky top-0 z-30 flex min-h-14 flex-col border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <ProtectedMobileNavSheet user={user} />
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
            <Link href="/">
              <ArrowUpRight data-icon="inline-start" />
              回首頁
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
