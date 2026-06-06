import "server-only";

import { tappayCurrency } from "@/lib/currency";

type BindTapPaySandboxCardInput = {
  prime: string;
  cardholder: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
};

type TapPayBindCardResponse = {
  status: number;
  msg: string;
  card_secret?: {
    card_key?: string;
    card_token?: string;
  };
};

export type BoundTapPayCard = {
  providerCardKey: string;
  providerCardToken: string;
};

const tappaySandboxBindCardUrl = "https://sandbox.tappaysdk.com/tpc/card/bind";
const tappayRequestTimeoutMs = 30_000;

export async function bindTapPaySandboxCard({
  prime,
  cardholder,
}: BindTapPaySandboxCardInput): Promise<BoundTapPayCard> {
  if (process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE !== "sandbox") {
    throw new Error("TapPay sandbox mode is required for demo card binding.");
  }

  if (!prime) {
    throw new Error("TapPay prime is required for card binding.");
  }

  const partnerKey = process.env.TAPPAY_PARTNER_KEY;
  const merchantId = process.env.TAPPAY_MERCHANT_ID;

  if (!partnerKey || !merchantId) {
    throw new Error("Missing TapPay sandbox credentials.");
  }

  const response = await fetch(tappaySandboxBindCardUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": partnerKey,
    },
    body: JSON.stringify({
      prime,
      partner_key: partnerKey,
      merchant_id: merchantId,
      currency: tappayCurrency,
      cardholder: {
        phone_number: cardholder.phoneNumber ?? "",
        name: cardholder.name,
        email: cardholder.email,
      },
    }),
    signal: AbortSignal.timeout(tappayRequestTimeoutMs),
  });
  const result = (await response.json()) as TapPayBindCardResponse;

  if (result.status !== 0) {
    throw new Error(result.msg || "TapPay sandbox 綁卡失敗。");
  }

  if (!result.card_secret?.card_key || !result.card_secret.card_token) {
    throw new Error("TapPay sandbox 未回傳可用的卡片 token。");
  }

  return {
    providerCardKey: result.card_secret.card_key,
    providerCardToken: result.card_secret.card_token,
  };
}
