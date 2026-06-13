import "server-only";

import {
  callTapPaySandbox,
  tappaySandboxPayByPrimeUrl,
  tappaySandboxPayByTokenUrl,
} from "./processTapPaySandboxPaymentParts/client";
import {
  getTapPaySandboxCredentials,
  requireTapPaySandboxMode,
} from "./processTapPaySandboxPaymentParts/env";
import {
  toTapPayPayByPrimeRequest,
  toTapPayPayByTokenRequest,
} from "./processTapPaySandboxPaymentParts/mappers";
import {
  createFailedPayment,
  toTapPayPaymentResult,
} from "./processTapPaySandboxPaymentParts/results";
import type {
  TapPaySandboxPaymentResult,
  TapPaySandboxPayByPrimeInput,
  TapPaySandboxPayByTokenInput,
} from "./processTapPaySandboxPaymentParts/types";

export type { TapPaySandboxPaymentResult };

export async function processTapPaySandboxPayment(
  input: TapPaySandboxPayByPrimeInput,
): Promise<TapPaySandboxPaymentResult> {
  requireTapPaySandboxMode();
  const { orderNumber, amountCents, prime, cardholder, details } = input;

  if (!prime || amountCents <= 0) {
    return createFailedPayment(orderNumber, "INVALID_PAYMENT_INPUT");
  }

  if (input.simulateFailure) {
    return createFailedPayment(orderNumber, "SANDBOX_CARD_DECLINED");
  }

  const credentials = getTapPaySandboxCredentials();
  const result = await callTapPaySandbox(
    tappaySandboxPayByPrimeUrl,
    toTapPayPayByPrimeRequest({
      prime,
      orderNumber,
      amountCents,
      cardholder,
      details,
      credentials,
    }),
  );

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
  requireTapPaySandboxMode();

  if (!cardKey || !cardToken || amountCents <= 0) {
    return createFailedPayment(orderNumber, "INVALID_PAYMENT_INPUT");
  }

  if (simulateFailure) {
    return createFailedPayment(orderNumber, "SANDBOX_CARD_DECLINED");
  }

  const credentials = getTapPaySandboxCredentials();
  const result = await callTapPaySandbox(
    tappaySandboxPayByTokenUrl,
    toTapPayPayByTokenRequest({
      cardKey,
      cardToken,
      orderNumber,
      amountCents,
      cardholder,
      details,
      credentials,
    }),
  );

  return toTapPayPaymentResult(orderNumber, result);
}
