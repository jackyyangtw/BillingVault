"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  Receipt,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/tailwind-css/utils";
import type { UserProfile } from "@/lib/auth/types";

const primaryLinks = [
  {
    label: "帳務管理",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    label: "模擬 SaaS 訂閱結帳",
    href: "/checkout",
    icon: CreditCard,
  },
  {
    label: "付款方式管理",
    href: "/payment",
    icon: Receipt,
  },
  {
    label: "訂閱管理",
    href: "/subscription",
    icon: FileText,
  },
];

const insightLinks = [
  {
    label: "Analytics",
    href: "/account#analytics",
    icon: BarChart3,
  },
  {
    label: "Security",
    href: "/account#security",
    icon: ShieldCheck,
  },
  {
    label: "Access Control",
    href: "/account#access",
    icon: LockKeyhole,
  },
];

type SidebarNavLink = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

type ProtectedSidebarProps = {
  user: UserProfile | null;
};

export default function ProtectedSidebar({ user }: ProtectedSidebarProps) {
  const pathname = usePathname();
  const userName = user?.name || "SecureCart User";
  const avatarInitial = userName.trim().charAt(0).toUpperCase() || "S";

  return (
    <aside className="border-border/70 bg-background/95 fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:flex lg:flex-col">
      <div className="border-border/70 flex h-14 items-center gap-3 border-b px-4">
        <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
          {avatarInitial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{userName}</p>
          <p className="text-muted-foreground truncate text-xs">
            {user?.email || "Subscription Console"}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        <SidebarSearch />
        <SidebarGroup links={primaryLinks} pathname={pathname} />
        <SidebarGroup
          title="Operations"
          links={insightLinks}
          pathname={pathname}
        />
      </nav>

      <div className="border-border/70 border-t p-3">
        <SidebarLink
          label="Settings"
          href="/account#settings"
          icon={Settings}
          active={false}
        />
      </div>
    </aside>
  );
}

function SidebarSearch() {
  return (
    <div className="border-border bg-muted/30 text-muted-foreground flex h-9 items-center justify-between rounded-xl border px-3 text-sm">
      <span>Find...</span>
      <kbd className="border-border bg-background rounded-md border px-1.5 py-0.5 text-xs">
        F
      </kbd>
    </div>
  );
}

type SidebarGroupProps = {
  title?: string;
  links: SidebarNavLink[];
  pathname: string;
};

function SidebarGroup({ title, links, pathname }: SidebarGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      {title && (
        <p className="text-muted-foreground px-3 pb-1 text-xs font-medium">
          {title}
        </p>
      )}
      {links.map((link) => (
        <SidebarLink
          key={link.href}
          label={link.label}
          href={link.href}
          icon={link.icon}
          active={isActiveLink(pathname, link.href)}
        />
      ))}
    </div>
  );
}

type SidebarLinkProps = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
};

function SidebarLink({ label, href, icon: Icon, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
        active && "bg-muted text-foreground",
      )}
    >
      <Icon />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function isActiveLink(pathname: string, href: string) {
  if (href.includes("#")) {
    return false;
  }

  const baseHref = href.split("#")[0];

  if (baseHref === "/account") {
    return pathname === "/account";
  }

  return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}
