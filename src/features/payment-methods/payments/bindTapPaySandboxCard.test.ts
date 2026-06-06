import { afterEach, describe, expect, it, vi } from "vitest";
import { bindTapPaySandboxCard } from "@/features/payment-methods/payments/bindTapPaySandboxCard";

describe("綁定 TapPay sandbox 卡片", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("呼叫 TapPay sandbox Bind Card 並回傳卡片 token", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    vi.stubEnv("TAPPAY_PARTNER_KEY", "partner_test");
    vi.stubEnv("TAPPAY_MERCHANT_ID", "merchant_test");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 0,
          msg: "Success",
          card_secret: {
            card_key: "CARD_KEY",
            card_token: "CARD_TOKEN",
          },
        }),
      ),
    );

    await expect(
      bindTapPaySandboxCard({
        prime: "test_prime",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
        },
      }),
    ).resolves.toEqual({
      providerCardKey: "CARD_KEY",
      providerCardToken: "CARD_TOKEN",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://sandbox.tappaysdk.com/tpc/card/bind",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "partner_test",
        },
        body: JSON.stringify({
          prime: "test_prime",
          partner_key: "partner_test",
          merchant_id: "merchant_test",
          currency: "TWD",
          cardholder: {
            phone_number: "",
            name: "SecureCart",
            email: "billing@example.com",
          },
        }),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("TapPay sandbox 綁卡失敗時拒絕保存卡片", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    vi.stubEnv("TAPPAY_PARTNER_KEY", "partner_test");
    vi.stubEnv("TAPPAY_MERCHANT_ID", "merchant_test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 10005,
          msg: "Card declined",
        }),
      ),
    );

    await expect(
      bindTapPaySandboxCard({
        prime: "test_prime",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
        },
      }),
    ).rejects.toThrow("Card declined");
  });

  it("缺少 TapPay server-only 憑證時拒絕綁卡", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    vi.stubEnv("TAPPAY_PARTNER_KEY", "");
    vi.stubEnv("TAPPAY_MERCHANT_ID", "");

    await expect(
      bindTapPaySandboxCard({
        prime: "test_prime",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
        },
      }),
    ).rejects.toThrow("Missing TapPay sandbox credentials.");
  });
});
