"use client";

import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setDefaultPaymentMethodAction } from "../_actions/setDefaultPaymentMethod";

type PaymentMethodDefaultButtonProps = {
  id: string;
  disabled?: boolean;
};

export default function PaymentMethodDefaultButton({
  id,
  disabled = false,
}: PaymentMethodDefaultButtonProps) {
  const setDefaultMutation = useMutation({
    mutationKey: ["payment-methods", "set-default", id],
    mutationFn: setDefaultPaymentMethodAction,
    onSuccess: () => {
      toast.success("已設為預設付款方式");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "預設付款方式設定失敗。",
      );
    },
  });
  const isSettingDefault = setDefaultMutation.isPending;

  function handleSetDefault() {
    setDefaultMutation.mutate({ id });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="cursor-pointer"
      disabled={disabled || isSettingDefault}
      onClick={handleSetDefault}
    >
      {isSettingDefault && (
        <LoaderCircle data-icon="inline-start" className="animate-spin" />
      )}
      設為預設
    </Button>
  );
}
