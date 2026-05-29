import { afterEach, describe, expect, it, vi } from "vitest";
import { processTapPaySandboxPayment } from "@/features/checkout/payments/processTapPaySandboxPayment";

describe("processTapPaySandboxPayment", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("回傳 sandbox 授權成功結果", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");

    await expect(
      processTapPaySandboxPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        prime: "test_prime",
      }),
    ).resolves.toMatchObject({
      status: "succeeded",
      providerStatusCode: "0",
    });
  });

  it("可模擬 sandbox 授權失敗", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");

    await expect(
      processTapPaySandboxPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        prime: "test_prime",
        simulateFailure: true,
      }),
    ).resolves.toMatchObject({
      status: "failed",
      failureCode: "SANDBOX_CARD_DECLINED",
    });
  });

  it("拒絕非 sandbox 模式", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "production");

    await expect(
      processTapPaySandboxPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        prime: "test_prime",
      }),
    ).rejects.toThrow("TapPay sandbox mode is required");
  });
});
