export function requireTapPaySandboxMode() {
  if (process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE !== "sandbox") {
    throw new Error("TapPay sandbox mode is required for demo checkout.");
  }
}

export function getTapPaySandboxCredentials() {
  const partnerKey = process.env.TAPPAY_PARTNER_KEY;
  const merchantId = process.env.TAPPAY_MERCHANT_ID;

  if (!partnerKey || !merchantId) {
    throw new Error("Missing TapPay sandbox credentials.");
  }

  return { partnerKey, merchantId };
}
