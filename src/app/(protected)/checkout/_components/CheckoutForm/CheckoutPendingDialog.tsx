import { LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CheckoutPendingDialogProps = {
  isOpen: boolean;
};

function preventDialogClose(event: Event) {
  event.preventDefault();
}

export default function CheckoutPendingDialog({
  isOpen,
}: CheckoutPendingDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={preventDialogClose}
        onPointerDownOutside={preventDialogClose}
      >
        <DialogHeader className="items-center text-center">
          <LoaderCircle className="text-primary mb-2 animate-spin" />
          <DialogTitle>正在結帳</DialogTitle>
          <DialogDescription>
            正在建立訂單與處理付款資訊，請不要重新整理或離開此頁面。
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
