import { centsToTapPayAmount, tappayCurrency } from "@/lib/currency";
import type { TapPayCardholder } from "./types";

type TapPaySandboxCredentials = {
  partnerKey: string;
  merchantId: string;
};

type PayByPrimeRequestInput = {
  prime: string;
  orderNumber: string;
  amountCents: number;
  cardholder: TapPayCardholder;
  details: string;
  credentials: TapPaySandboxCredentials;
};

type PayByTokenRequestInput = {
  cardKey: string;
  cardToken: string;
  orderNumber: string;
  amountCents: number;
  cardholder: TapPayCardholder;
  details: string;
  credentials: TapPaySandboxCredentials;
};

export function toTapPayPayByPrimeRequest({
  prime,
  orderNumber,
  amountCents,
  cardholder,
  details,
  credentials,
}: PayByPrimeRequestInput) {
  return {
    prime,
    partner_key: credentials.partnerKey,
    merchant_id: credentials.merchantId,
    amount: centsToTapPayAmount(amountCents),
    currency: tappayCurrency,
    details,
    order_number: orderNumber,
    cardholder: toTapPayCardholder(cardholder),
    remember: true,
  };
}

export function toTapPayPayByTokenRequest({
  cardKey,
  cardToken,
  orderNumber,
  amountCents,
  cardholder,
  details,
  credentials,
}: PayByTokenRequestInput) {
  return {
    card_key: cardKey,
    card_token: cardToken,
    partner_key: credentials.partnerKey,
    merchant_id: credentials.merchantId,
    amount: centsToTapPayAmount(amountCents),
    currency: tappayCurrency,
    details,
    order_number: orderNumber,
    cardholder: toTapPayCardholder(cardholder),
  };
}

function toTapPayCardholder(cardholder: TapPayCardholder) {
  return {
    phone_number: cardholder.phoneNumber ?? "",
    name: cardholder.name,
    email: cardholder.email,
    address: cardholder.address,
  };
}
