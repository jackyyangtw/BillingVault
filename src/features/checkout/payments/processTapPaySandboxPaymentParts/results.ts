import type {
  TapPayCardSecret,
  TapPayPayByPrimeResponse,
  TapPaySandboxPaymentResult,
} from "./types";

export function toTapPayPaymentResult(
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

export function createFailedPayment(
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

function toCardSecret(cardSecret?: TapPayCardSecret) {
  if (!cardSecret?.card_key || !cardSecret.card_token) {
    return undefined;
  }

  return {
    cardKey: cardSecret.card_key,
    cardToken: cardSecret.card_token,
  };
}
