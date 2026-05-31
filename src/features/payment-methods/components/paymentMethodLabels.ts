import type {
  PaymentMethod,
  PaymentMethodStatus,
} from "@/features/payment-methods/dal/types";

export const paymentMethodStatusLabel: Record<PaymentMethodStatus, string> = {
  primary: "預設扣款",
  backup: "備援卡",
  expired: "已過期",
};

export const tappayStateLabel: Record<
  PaymentMethod["tappayPrimeState"],
  string
> = {
  ready: "TapPay prime 可用",
  requires_refresh: "需要重新綁定",
  unavailable: "尚未啟用",
};
