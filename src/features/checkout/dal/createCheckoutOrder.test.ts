import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  order: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  paymentRecord: {
    update: vi.fn(),
  },
  invoice: {
    create: vi.fn(),
  },
  subscription: {
    create: vi.fn(),
  },
  paymentMethod: {
    findFirst: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/features/checkout/payments/processTapPaySandboxPayment", () => ({
  processTapPaySandboxPayment: vi.fn(),
  processTapPaySandboxTokenPayment: vi.fn(),
}));

import { processTapPaySandboxTokenPayment } from "@/features/checkout/payments/processTapPaySandboxPayment";
import { createCheckoutOrder } from "./createCheckoutOrder";

const userId = "22222222-2222-4222-8222-222222222222";
const paymentMethodId = "11111111-1111-4111-8111-111111111111";

describe("建立結帳訂單", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    prismaMock.order.findFirst.mockResolvedValue(null);
    prismaMock.order.create.mockResolvedValue({
      id: "33333333-3333-4333-8333-333333333333",
      orderNumber: "SC20260603TEST",
      payments: [{ id: "44444444-4444-4444-8444-444444444444" }],
    });
    prismaMock.$transaction.mockImplementation(async (callback) => {
      if (Array.isArray(callback)) {
        return Promise.all(callback);
      }

      return callback(prismaMock);
    });
  });

  it("已儲存卡片有 TapPay token 時可完成扣款", async () => {
    prismaMock.paymentMethod.findFirst.mockResolvedValue({
      id: paymentMethodId,
      tappayPrimeState: "ready",
      expMonth: 12,
      expYear: 2099,
      providerCardKey: "CARD_KEY",
      providerCardToken: "CARD_TOKEN",
      cardIdentifier: "card_identifier",
      last4: "4242",
    });
    vi.mocked(processTapPaySandboxTokenPayment).mockResolvedValue({
      status: "succeeded",
      providerTradeId: "SANDBOX_TOKEN_TRADE_ID",
      providerStatusCode: "0",
      providerMessage: "Success",
    });

    await expect(
      createCheckoutOrder(userId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        paymentMethodId,
      }),
    ).resolves.toMatchObject({
      status: "succeeded",
      providerTradeId: "SANDBOX_TOKEN_TRADE_ID",
    });

    expect(prismaMock.paymentMethod.findFirst).toHaveBeenCalledWith({
      where: {
        id: paymentMethodId,
        userId,
      },
    });
    expect(processTapPaySandboxTokenPayment).toHaveBeenCalledWith({
      orderNumber: expect.stringMatching(/^SC\d{8}[A-Z0-9]{10}$/),
      amountCents: 144000,
      cardKey: "CARD_KEY",
      cardToken: "CARD_TOKEN",
      details: "CodeGuard Pro subscription",
      cardholder: {
        name: "SecureCart",
        email: "billing@example.com",
        address: "台北市信義區",
      },
      simulateFailure: undefined,
    });
    expect(prismaMock.paymentRecord.update).toHaveBeenCalledWith({
      where: { id: "44444444-4444-4444-8444-444444444444" },
      data: {
        status: "succeeded",
        providerTradeId: "SANDBOX_TOKEN_TRADE_ID",
        providerStatusCode: "0",
        providerMessage: "Success",
      },
    });
  });

  it("已儲存卡片缺少 TapPay token 時要求重新綁定", async () => {
    prismaMock.paymentMethod.findFirst.mockResolvedValue({
      id: paymentMethodId,
      tappayPrimeState: "ready",
      expMonth: 12,
      expYear: 2099,
      providerCardKey: null,
      providerCardToken: null,
    });

    await expect(
      createCheckoutOrder(userId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        paymentMethodId,
      }),
    ).rejects.toThrow("此卡片需要重新綁定後才能用於扣款。");

    expect(prismaMock.order.create).not.toHaveBeenCalled();
  });
});
