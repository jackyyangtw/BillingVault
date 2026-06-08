"use client";

import { MessageCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EnterpriseInquiryDialogProps = {
  triggerLabel: string;
  triggerClassName?: string;
  triggerVariant?: ComponentProps<typeof Button>["variant"];
  showTriggerIcon?: boolean;
};

export default function EnterpriseInquiryDialog({
  triggerLabel,
  triggerClassName,
  triggerVariant = "outline",
  showTriggerIcon = false,
}: EnterpriseInquiryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          className={triggerClassName}
        >
          {showTriggerIcon && <MessageCircle data-icon="inline-start" />}
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-8 sm:max-w-lg">
        <DialogHeader className="gap-3">
          <DialogTitle>這單有點大，先別急著結帳</DialogTitle>
          <DialogDescription className="mt-4">
            Enterprise
            方案通常不是「刷卡就帶走」的等級。我們會依照規模、整合需求與支援等級，提供比較像樣的客製報價。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">了解，先聊聊需求</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
