import type { ReactNode } from "react";
import { cn } from "@/lib/tailwind-css/utils";

type LockedFieldValueProps = {
  id?: string;
  children: ReactNode;
  isInvalid?: boolean;
};

export default function LockedFieldValue({
  id,
  children,
  isInvalid = false,
}: LockedFieldValueProps) {
  return (
    <div
      id={id}
      className={cn(
        "border-input bg-input/30 text-muted-foreground flex h-9 w-full items-center rounded-3xl border px-3 text-sm opacity-80",
        isInvalid && "border-destructive",
      )}
    >
      {children}
    </div>
  );
}
