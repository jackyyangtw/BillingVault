"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PaymentMethod } from "@/lib/payment-methods/types";
import { deletePaymentMethodAction } from "../actions";

type PaymentMethodActionsProps = {
  method: Pick<PaymentMethod, "id" | "brand" | "last4">;
};

export default function PaymentMethodActions({
  method,
}: PaymentMethodActionsProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationKey: ["payment-methods", "delete", method.id],
    mutationFn: deletePaymentMethodAction,
    onSuccess: () => {
      setIsConfirmOpen(false);
      toast.success("卡片已刪除");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "卡片刪除失敗。");
    },
  });
  const isDeleting = deleteMutation.isPending;

  function handleDelete() {
    deleteMutation.mutate({ id: method.id });
  }

  return (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="卡片操作">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                setIsConfirmOpen(true);
              }}
            >
              <Trash2 />
              刪除卡片
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>刪除這張卡片？</AlertDialogTitle>
          <AlertDialogDescription>
            {method.brand} ending in {method.last4}{" "}
            會從付款方式中移除。這個動作無法復原。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting && (
              <LoaderCircle data-icon="inline-start" className="animate-spin" />
            )}
            刪除
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
