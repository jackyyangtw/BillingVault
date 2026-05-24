"use client";

import { useState } from "react";
import { CalendarX } from "lucide-react";
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

type CancelSubscriptionDialogProps = {
  renewalDateLabel: string;
};

export default function CancelSubscriptionDialog({
  renewalDateLabel,
}: CancelSubscriptionDialogProps) {
  const [isCancellationScheduled, setIsCancellationScheduled] = useState(false);

  function handleConfirmCancel() {
    setIsCancellationScheduled(true);
  }

  if (isCancellationScheduled) {
    return (
      <Button variant="secondary" className="w-full" disabled>
        取消已排程
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <CalendarX data-icon="inline-start" />
          取消訂閱
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確認取消訂閱？</DialogTitle>
          <DialogDescription>
            取消後仍可使用到 {renewalDateLabel}
            ，到期後將停止續訂並保留帳務紀錄。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">返回</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              確認取消
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
