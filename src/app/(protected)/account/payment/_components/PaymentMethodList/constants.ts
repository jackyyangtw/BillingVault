import type { ComponentType, SVGProps } from "react";
import {
  AmericanExpressFlatRoundedIcon,
  GenericFlatRoundedIcon,
  JCBFlatRoundedIcon,
  MastercardFlatRoundedIcon,
  UnionPayFlatRoundedIcon,
  VisaFlatRoundedIcon,
} from "react-svg-credit-card-payment-icons";
import type {
  PaymentMethod,
  PaymentMethodStatus,
} from "@/features/payment-methods/dal/types";

type PaymentCardIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const statusLabel: Record<PaymentMethodStatus, string> = {
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

export const cardBrandIcon: Record<string, PaymentCardIcon> = {
  americanexpress: AmericanExpressFlatRoundedIcon,
  amex: AmericanExpressFlatRoundedIcon,
  jcb: JCBFlatRoundedIcon,
  mastercard: MastercardFlatRoundedIcon,
  unionpay: UnionPayFlatRoundedIcon,
  visa: VisaFlatRoundedIcon,
};

export const fallbackCardBrandIcon = GenericFlatRoundedIcon;
