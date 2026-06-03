import "server-only";

type TapPaySandboxPaymentInput = {
  orderNumber: string;
  amountCents: number;
  cardholder: TapPayCardholder;
  details: string;
  simulateFailure?: boolean;
};

type TapPaySandboxPayByPrimeInput = TapPaySandboxPaymentInput & {
  prime: string;
};

type TapPaySandboxPayByTokenInput = TapPaySandboxPaymentInput & {
  cardKey: string;
  cardToken: string;
};

type TapPayCardholder = {
  name: string;
  email: string;
  address: string;
  phoneNumber?: string;
};

type TapPayCardSecret = {
  card_key?: string;
  card_token?: string;
};

export type TapPaySandboxPaymentResult =
  | {
      status: "succeeded";
      providerTradeId: string;
      providerStatusCode: "0";
      providerMessage: string;
      cardSecret?: {
        cardKey: string;
        cardToken: string;
      };
    }
  | {
      status: "failed";
      providerTradeId: string;
      providerStatusCode: string;
      providerMessage: string;
      failureCode: string;
      failureMessage: string;
    };

type TapPayPayByPrimeResponse = {
  status: number;
  msg: string;
  rec_trade_id?: string;
  card_secret?: TapPayCardSecret;
};

const tappaySandboxPayByPrimeUrl =
  "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime";
const tappaySandboxPayByTokenUrl =
  "https://sandbox.tappaysdk.com/tpc/payment/pay-by-token";
const tappayRequestTimeoutMs = 30_000;

export async function processTapPaySandboxPayment(
  input: TapPaySandboxPayByPrimeInput,
): Promise<TapPaySandboxPaymentResult> {
  const credentials = getTapPaySandboxCredentials();
  const { orderNumber, amountCents, prime, cardholder, details } = input;

  if (!prime || amountCents <= 0) {
    return createFailedPayment(orderNumber, "INVALID_PAYMENT_INPUT");
  }

  if (input.simulateFailure) {
    return createFailedPayment(orderNumber, "SANDBOX_CARD_DECLINED");
  }

  const result = await callTapPaySandbox(tappaySandboxPayByPrimeUrl, {
    prime,
    partner_key: credentials.partnerKey,
    merchant_id: credentials.merchantId,
    amount: amountCents,
    currency: "TWD",
    details,
    order_number: orderNumber,
    cardholder: toTapPayCardholder(cardholder),
    remember: true,
  });

  return toTapPayPaymentResult(orderNumber, result);
}

export async function processTapPaySandboxTokenPayment({
  orderNumber,
  amountCents,
  cardKey,
  cardToken,
  cardholder,
  details,
  simulateFailure = false,
}: TapPaySandboxPayByTokenInput): Promise<TapPaySandboxPaymentResult> {
  const credentials = getTapPaySandboxCredentials();

  if (!cardKey || !cardToken || amountCents <= 0) {
    return createFailedPayment(orderNumber, "INVALID_PAYMENT_INPUT");
  }

  if (simulateFailure) {
    return createFailedPayment(orderNumber, "SANDBOX_CARD_DECLINED");
  }

  const result = await callTapPaySandbox(tappaySandboxPayByTokenUrl, {
    card_key: cardKey,
    card_token: cardToken,
    partner_key: credentials.partnerKey,
    merchant_id: credentials.merchantId,
    amount: amountCents,
    currency: "TWD",
    details,
    order_number: orderNumber,
    cardholder: toTapPayCardholder(cardholder),
  });

  return toTapPayPaymentResult(orderNumber, result);
}

function getTapPaySandboxCredentials() {
  if (process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE !== "sandbox") {
    throw new Error("TapPay sandbox mode is required for demo checkout.");
  }

  const partnerKey = process.env.TAPPAY_PARTNER_KEY;
  const merchantId = process.env.TAPPAY_MERCHANT_ID;

  if (!partnerKey || !merchantId) {
    throw new Error("Missing TapPay sandbox credentials.");
  }

  return { partnerKey, merchantId };
}

async function callTapPaySandbox(
  url: string,
  body: Record<string, unknown>,
): Promise<TapPayPayByPrimeResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": String(body.partner_key),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(tappayRequestTimeoutMs),
  });

  return (await response.json()) as TapPayPayByPrimeResponse;
}

function toTapPayCardholder(cardholder: TapPayCardholder) {
  return {
    phone_number: cardholder.phoneNumber ?? "",
    name: cardholder.name,
    email: cardholder.email,
    address: cardholder.address,
  };
}

function toTapPayPaymentResult(
  orderNumber: string,
  result: TapPayPayByPrimeResponse,
): TapPaySandboxPaymentResult {
  if (result.status !== 0) {
    return {
      status: "failed",
      providerTradeId: result.rec_trade_id ?? orderNumber,
      providerStatusCode: String(result.status),
      providerMessage: result.msg || "TapPay sandbox payment failed.",
      failureCode: `TAPPAY_${result.status}`,
      failureMessage: result.msg || "TapPay sandbox 授權失敗。",
    };
  }

  if (!result.rec_trade_id) {
    return createFailedPayment(orderNumber, "MISSING_REC_TRADE_ID");
  }

  return {
    status: "succeeded",
    providerTradeId: result.rec_trade_id,
    providerStatusCode: "0",
    providerMessage: result.msg || "TapPay sandbox payment authorized.",
    cardSecret: toCardSecret(result.card_secret),
  };
}

function toCardSecret(cardSecret?: TapPayCardSecret) {
  if (!cardSecret?.card_key || !cardSecret.card_token) {
    return undefined;
  }

  return {
    cardKey: cardSecret.card_key,
    cardToken: cardSecret.card_token,
  };
}

function createFailedPayment(
  orderNumber: string,
  failureCode: string,
): TapPaySandboxPaymentResult {
  return {
    status: "failed",
    providerTradeId: orderNumber,
    providerStatusCode: "10005",
    providerMessage: "TapPay sandbox payment declined.",
    failureCode,
    failureMessage: "TapPay sandbox 模擬授權失敗。",
  };
}
