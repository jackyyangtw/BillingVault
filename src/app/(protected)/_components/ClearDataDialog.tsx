"use client";

import { useTransition } from "react";
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

export default function ClearDataDialog({
  open,
  onOpenChange,
}: ClearDataDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await clearAccountDataAction();
        toast.success("帳號資料已清除");
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "清除失敗，請稍後再試。",
        );
      }
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    onOpenChange(nextOpen);
  }

  return (
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
            {isPending && (
              <LoaderCircle data-icon="inline-start" className="animate-spin" />
            )}
            確認清除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
