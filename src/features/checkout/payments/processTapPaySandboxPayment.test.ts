import { afterEach, describe, expect, it, vi } from "vitest";
import {
  processTapPaySandboxPayment,
  processTapPaySandboxTokenPayment,
} from "@/features/checkout/payments/processTapPaySandboxPayment";

describe("處理 TapPay sandbox 付款", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("呼叫 TapPay sandbox Pay by Prime 並回傳授權成功結果", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    vi.stubEnv("TAPPAY_PARTNER_KEY", "partner_test");
    vi.stubEnv("TAPPAY_MERCHANT_ID", "merchant_test");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 0,
          msg: "Success",
          rec_trade_id: "SANDBOX_TRADE_ID",
          card_secret: {
            card_key: "CARD_KEY",
            card_token: "CARD_TOKEN",
          },
        }),
      ),
    );

    await expect(
      processTapPaySandboxPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        prime: "test_prime",
        details: "CodeGuard Pro subscription",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
          address: "台北市信義區",
        },
      }),
    ).resolves.toMatchObject({
      status: "succeeded",
      providerStatusCode: "0",
      providerTradeId: "SANDBOX_TRADE_ID",
      cardSecret: {
        cardKey: "CARD_KEY",
        cardToken: "CARD_TOKEN",
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
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
          amount: 48,
          currency: "TWD",
          details: "CodeGuard Pro subscription",
          order_number: "SC20260529TEST",
          cardholder: {
            phone_number: "",
            name: "SecureCart",
            email: "billing@example.com",
            address: "台北市信義區",
          },
          remember: true,
        }),
      }),
    );
  });

  it("呼叫 TapPay sandbox Pay by Card Token 並回傳授權成功結果", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    vi.stubEnv("TAPPAY_PARTNER_KEY", "partner_test");
    vi.stubEnv("TAPPAY_MERCHANT_ID", "merchant_test");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 0,
          msg: "Success",
          rec_trade_id: "SANDBOX_TOKEN_TRADE_ID",
        }),
      ),
    );

    await expect(
      processTapPaySandboxTokenPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        cardKey: "CARD_KEY",
        cardToken: "CARD_TOKEN",
        details: "CodeGuard Pro subscription",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
          address: "台北市信義區",
        },
      }),
    ).resolves.toMatchObject({
      status: "succeeded",
      providerStatusCode: "0",
      providerTradeId: "SANDBOX_TOKEN_TRADE_ID",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://sandbox.tappaysdk.com/tpc/payment/pay-by-token",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "partner_test",
        },
        body: JSON.stringify({
          card_key: "CARD_KEY",
          card_token: "CARD_TOKEN",
          partner_key: "partner_test",
          merchant_id: "merchant_test",
          amount: 48,
          currency: "TWD",
          details: "CodeGuard Pro subscription",
          order_number: "SC20260529TEST",
          cardholder: {
            phone_number: "",
            name: "SecureCart",
            email: "billing@example.com",
            address: "台北市信義區",
          },
        }),
      }),
    );
  });

  it("保存 TapPay sandbox 授權失敗結果", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    vi.stubEnv("TAPPAY_PARTNER_KEY", "partner_test");
    vi.stubEnv("TAPPAY_MERCHANT_ID", "merchant_test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 10005,
          msg: "Card declined",
          rec_trade_id: "SANDBOX_FAILED_TRADE_ID",
        }),
      ),
    );

    await expect(
      processTapPaySandboxPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        prime: "test_prime",
        details: "CodeGuard Pro subscription",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
          address: "台北市信義區",
        },
      }),
    ).resolves.toMatchObject({
      status: "failed",
      providerTradeId: "SANDBOX_FAILED_TRADE_ID",
      providerStatusCode: "10005",
      failureCode: "TAPPAY_10005",
      failureMessage: "Card declined",
    });
  });

  it("可模擬 sandbox 授權失敗", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");

    await expect(
      processTapPaySandboxPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        prime: "test_prime",
        details: "CodeGuard Pro subscription",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
          address: "台北市信義區",
        },
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
        details: "CodeGuard Pro subscription",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
          address: "台北市信義區",
        },
      }),
    ).rejects.toThrow("TapPay sandbox mode is required");
  });

  it("缺少 TapPay server-only 憑證時拒絕授權", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    vi.stubEnv("TAPPAY_PARTNER_KEY", "");
    vi.stubEnv("TAPPAY_MERCHANT_ID", "");

    await expect(
      processTapPaySandboxPayment({
        orderNumber: "SC20260529TEST",
        amountCents: 4800,
        prime: "test_prime",
        details: "CodeGuard Pro subscription",
        cardholder: {
          name: "SecureCart",
          email: "billing@example.com",
          address: "台北市信義區",
        },
      }),
    ).rejects.toThrow("Missing TapPay sandbox credentials.");
  });
});
