import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import type { UserProfile } from "@/lib/auth/types";
import ProtectedMobileNavSheet from "./ProtectedMobileNavSheet";
import ProtectedLogo from "./ProtectedLogo";

type ProtectedTopbarProps = {
  user: UserProfile | null;
};

export default function ProtectedTopbar({ user }: ProtectedTopbarProps) {
  return (
    <header className="border-border/70 bg-background/95 sticky top-0 z-30 flex min-h-14 flex-col border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <ProtectedLogo />
          <ProtectedMobileNavSheet user={user} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
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
