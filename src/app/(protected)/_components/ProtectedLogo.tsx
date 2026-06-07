import { ShieldCheck } from "lucide-react";
export default function ProtectedLogo() {
  return (
    <>
      <div className="bg-primary/10 text-primary hidden size-8 items-center justify-center rounded-lg sm:flex">
        <ShieldCheck />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">SecureCart Console</p>
        <p className="text-muted-foreground hidden truncate text-xs sm:block">
          Billing, payments, subscriptions
        </p>
      </div>
    </>
  );
}
