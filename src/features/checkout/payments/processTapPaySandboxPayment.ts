import "server-only";

import { randomUUID } from "node:crypto";

type TapPaySandboxPaymentInput = {
  orderNumber: string;
  amountCents: number;
  prime: string;
  simulateFailure?: boolean;
};

export type TapPaySandboxPaymentResult =
  | {
      status: "succeeded";
      providerTradeId: string;
      providerStatusCode: "0";
      providerMessage: string;
    }
  | {
      status: "failed";
      providerTradeId: string;
      providerStatusCode: string;
      providerMessage: string;
      failureCode: string;
      failureMessage: string;
    };

export async function processTapPaySandboxPayment({
  orderNumber,
  amountCents,
  prime,
  simulateFailure = false,
}: TapPaySandboxPaymentInput): Promise<TapPaySandboxPaymentResult> {
  if (process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE !== "sandbox") {
    throw new Error("TapPay sandbox mode is required for demo checkout.");
  }

  if (!prime || amountCents <= 0) {
    return createFailedPayment(orderNumber, "INVALID_PAYMENT_INPUT");
  }

  if (simulateFailure) {
    return createFailedPayment(orderNumber, "SANDBOX_CARD_DECLINED");
  }

  return {
    status: "succeeded",
    providerTradeId: createSandboxTradeId(orderNumber),
    providerStatusCode: "0",
    providerMessage: "TapPay sandbox payment authorized.",
  };
}

function createFailedPayment(
  orderNumber: string,
  failureCode: string,
): TapPaySandboxPaymentResult {
  return {
    status: "failed",
    providerTradeId: createSandboxTradeId(orderNumber),
    providerStatusCode: "10005",
    providerMessage: "TapPay sandbox payment declined.",
    failureCode,
    failureMessage: "TapPay sandbox 模擬授權失敗。",
  };
}

function createSandboxTradeId(orderNumber: string) {
  const suffix = randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();

  return `sandbox_${orderNumber}_${suffix}`;
}
