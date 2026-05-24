"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/tailwind-css/utils";
import type { UserProfile } from "@/lib/auth/types";
import {
  isActiveProtectedLink,
  protectedPrimaryLinks,
  type ProtectedNavLink,
} from "./protectedNavigation";
import ProtectedSidebarUserMenu from "./ProtectedSidebarUserMenu";

type ProtectedSidebarProps = {
  user: UserProfile | null;
};

export default function ProtectedSidebar({ user }: ProtectedSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-border/70 bg-background/95 fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:flex lg:flex-col">
      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        <SidebarSearch />
        <SidebarGroup links={protectedPrimaryLinks} pathname={pathname} />
      </nav>

      <div className="border-border/70 border-t p-3">
        <ProtectedSidebarUserMenu user={user} />
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
  links: readonly ProtectedNavLink[];
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
          active={isActiveProtectedLink(pathname, link.href)}
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
