import type { TapPayPayByPrimeResponse } from "./types";

const tappayRequestTimeoutMs = 30_000;

export const tappaySandboxPayByPrimeUrl =
  "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime";
export const tappaySandboxPayByTokenUrl =
  "https://sandbox.tappaysdk.com/tpc/payment/pay-by-token";

export async function callTapPaySandbox(
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
