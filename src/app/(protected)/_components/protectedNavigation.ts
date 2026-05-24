import type { ComponentType } from "react";
import { CreditCard, FileText, LayoutDashboard, Receipt } from "lucide-react";

export type ProtectedNavLink = {
  label: string;
  mobileLabel: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export const protectedPrimaryLinks = [
  {
    label: "帳務管理",
    mobileLabel: "帳務",
    href: "/account/billing",
    icon: LayoutDashboard,
  },
  {
    label: "模擬 SaaS 訂閱結帳",
    mobileLabel: "結帳",
    href: "/checkout",
    icon: CreditCard,
  },
  {
    label: "付款方式管理",
    mobileLabel: "付款",
    href: "/account/payment",
    icon: Receipt,
  },
  {
    label: "訂閱管理",
    mobileLabel: "訂閱",
    href: "/account/subscription",
    icon: FileText,
  },
] satisfies ProtectedNavLink[];

export function isActiveProtectedLink(pathname: string, href: string) {
  if (href.includes("#")) {
    return false;
  }

  const baseHref = href.split("#")[0];

  if (baseHref === "/account") {
    return pathname === "/account";
  }

  return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}
