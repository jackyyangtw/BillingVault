import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-border border-t py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <ShieldCheck className="size-4" />
            </span>
            SecureCart
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} SecureCart。以 Next.js App Router
            打造的 SaaS 結帳展示專案。
          </p>
          <div className="text-muted-foreground flex gap-4 text-sm">
            <Link href="#" className="hover:text-foreground transition-colors">
              隱私政策
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              服務條款
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              資安說明
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
