"use client";

import { CreditCard, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/tailwind-css/utils";

type NewPaymentMethodOptionProps = {
  hasPaymentMethods: boolean;
  isSelected: boolean;
  onSelect: () => void;
};

export default function NewPaymentMethodOption({
  hasPaymentMethods,
  isSelected,
  onSelect,
}: NewPaymentMethodOptionProps) {
  return (
    <button
      type="button"
      className={cn(
        "hover:bg-muted/40 focus-visible:ring-ring/30 grid gap-4 rounded-3xl border p-4 text-left transition-colors outline-none focus-visible:ring-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center",
        isSelected &&
          "border-primary/30 bg-primary/3 ring-primary/10 dark:border-primary/25 dark:bg-primary/8 dark:ring-primary/10 ring-1",
      )}
      aria-pressed={isSelected}
      onClick={onSelect}
    >
      <div className="bg-card/80 ring-foreground/10 dark:bg-foreground/5 dark:ring-foreground/10 flex size-16 items-center justify-center rounded-2xl shadow-sm ring-1">
        {hasPaymentMethods ? (
          <Plus aria-hidden="true" />
        ) : (
          <CreditCard aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold">使用新信用卡</p>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          透過 TapPay hosted fields 取得 prime，卡號不會進入前端狀態。
        </p>
      </div>
      {isSelected && (
        <div className="flex md:justify-end">
          <Badge>以此新增卡片結帳</Badge>
        </div>
      )}
    </button>
  );
}
