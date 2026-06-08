"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { clearAccountDataAction } from "@/features/account/actions/clearAccountData";

type ClearDataDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function preventDialogClose(event: Event) {
  event.preventDefault();
}

export default function ClearDataDialog({
  open,
  onOpenChange,
}: ClearDataDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isClearingDialogOpen, setIsClearingDialogOpen] = useState(false);

  function handleConfirm() {
    onOpenChange(false);
    setIsClearingDialogOpen(true);

    startTransition(async () => {
      try {
        await clearAccountDataAction();
        toast.success("帳號資料已清除");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "清除失敗，請稍後再試。",
        );
      } finally {
        setIsClearingDialogOpen(false);
      }
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    onOpenChange(nextOpen);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認清除所有資料？</DialogTitle>
            <DialogDescription>
              將永久刪除所有訂閱紀錄、方案變更、訂單與帳務資料，此操作無法復原。信用卡資訊不受影響。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirm}
            >
              確認清除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isClearingDialogOpen}>
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={preventDialogClose}
          onPointerDownOutside={preventDialogClose}
        >
          <DialogHeader className="items-center text-center">
            <LoaderCircle className="text-primary mb-2 animate-spin" />
            <DialogTitle>正在清除帳號資料</DialogTitle>
            <DialogDescription>
              正在清除訂閱、訂單與帳務紀錄，完成前請不要重新整理或離開此頁面。
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
