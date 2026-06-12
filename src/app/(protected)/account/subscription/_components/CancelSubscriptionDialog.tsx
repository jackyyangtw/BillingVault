"use client";

import { useState } from "react";
import { CalendarX, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCancelSubscription } from "@/features/subscriptions/queries/useCancelSubscription";

type CancelSubscriptionDialogProps = {
  subscriptionId: string;
  renewalDateLabel: string;
};

export default function CancelSubscriptionDialog({
  subscriptionId,
  renewalDateLabel,
}: CancelSubscriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelSubscriptionMutation = useCancelSubscription(subscriptionId);
  const isPending = cancelSubscriptionMutation.isPending;

  function handleConfirmCancel() {
    cancelSubscriptionMutation.mutate(
      { id: subscriptionId },
      {
        onSuccess: () => {
          toast.success("訂閱已取消");
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "取消訂閱失敗，請稍後再試。",
          );
        },
      },
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    setIsOpen(nextOpen);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <CalendarX aria-hidden="true" data-icon="inline-start" />
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
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            返回
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirmCancel}
          >
            {isPending && (
              <LoaderCircle
                aria-hidden="true"
                data-icon="inline-start"
                className="animate-spin"
              />
            )}
            確認取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
