"use client";

import { LogOut, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/logout";
import type { UserProfile } from "@/lib/auth/types";

type ProtectedSidebarUserMenuProps = {
  user: UserProfile | null;
};

export default function ProtectedSidebarUserMenu({
  user,
}: ProtectedSidebarUserMenuProps) {
  const userName = user?.name || "SecureCart User";
  const avatarInitial = userName.trim().charAt(0).toUpperCase() || "S";

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
        {avatarInitial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{userName}</p>
        <p className="text-muted-foreground truncate text-xs">
          {user?.email || "Subscription Console"}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="開啟使用者選單">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              登出
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
