import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function ProtectedLogo() {
  return (
    <Link
      href="/account/billing"
      className="hover:text-primary flex min-w-0 items-center gap-3 transition-colors"
    >
      <div className="bg-primary/10 text-primary hidden size-8 items-center justify-center rounded-lg sm:flex">
        <ShieldCheck />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">BillingVault Console</p>
        <p className="text-muted-foreground hidden truncate text-xs sm:block">
          Billing, payments, subscriptions
        </p>
      </div>
    </Link>
  );
}
