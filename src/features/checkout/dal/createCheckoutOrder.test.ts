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
    findMany: vi.fn(),
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
import {
  testCompletedOrderNumber,
  testCreatedOrderNumber,
  testIdempotencyKey,
  testOrderId,
  testPaymentMethodId,
  testPaymentRecordId,
  testPendingOrderNumber,
  testUserId,
} from "@/test/testIds";
import { createCheckoutOrder } from "./createCheckoutOrder";

describe("建立結帳訂單", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_TAPPAY_SERVER_TYPE", "sandbox");
    prismaMock.order.findFirst.mockResolvedValue(null);
    prismaMock.order.create.mockResolvedValue({
      id: testOrderId,
      orderNumber: testCreatedOrderNumber,
      payments: [{ id: testPaymentRecordId }],
    });
    prismaMock.subscription.findMany.mockResolvedValue([]);
    prismaMock.$transaction.mockImplementation(async (callback) => {
      if (Array.isArray(callback)) {
        return Promise.all(callback);
      }

      return callback(prismaMock);
    });
  });

  it("目前為 Business 方案時拒絕透過結帳選擇 Pro", async () => {
    prismaMock.subscription.findMany.mockResolvedValue([
      {
        planId: "business",
        cycle: "monthly",
        status: "active",
      },
    ]);

    await expect(
      createCheckoutOrder(testUserId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        idempotencyKey: testIdempotencyKey,
        paymentMethodId: testPaymentMethodId,
      }),
    ).rejects.toThrow("目前方案不可透過結帳降級，請到訂閱管理變更方案。");

    expect(prismaMock.paymentMethod.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.order.create).not.toHaveBeenCalled();
  });

  it("目前為年繳方案時拒絕透過結帳選擇月繳", async () => {
    prismaMock.subscription.findMany.mockResolvedValue([
      {
        planId: "pro",
        cycle: "yearly",
        status: "active",
      },
    ]);

    await expect(
      createCheckoutOrder(testUserId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        idempotencyKey: testIdempotencyKey,
        paymentMethodId: testPaymentMethodId,
      }),
    ).rejects.toThrow(
      "目前年繳方案不可透過結帳改為月繳，請到訂閱管理變更方案。",
    );

    expect(prismaMock.paymentMethod.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.order.create).not.toHaveBeenCalled();
  });

  it("已儲存卡片有 TapPay token 時可完成扣款", async () => {
    prismaMock.paymentMethod.findFirst.mockResolvedValue({
      id: testPaymentMethodId,
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
      createCheckoutOrder(testUserId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        idempotencyKey: testIdempotencyKey,
        paymentMethodId: testPaymentMethodId,
      }),
    ).resolves.toMatchObject({
      status: "succeeded",
      providerTradeId: "SANDBOX_TOKEN_TRADE_ID",
    });

    expect(prismaMock.paymentMethod.findFirst).toHaveBeenCalledWith({
      where: {
        id: testPaymentMethodId,
        userId: testUserId,
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
      where: { id: testPaymentRecordId },
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
      id: testPaymentMethodId,
      tappayPrimeState: "ready",
      expMonth: 12,
      expYear: 2099,
      providerCardKey: null,
      providerCardToken: null,
    });

    await expect(
      createCheckoutOrder(testUserId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        idempotencyKey: testIdempotencyKey,
        paymentMethodId: testPaymentMethodId,
      }),
    ).rejects.toThrow("此卡片需要重新綁定後才能用於扣款。");

    expect(prismaMock.order.create).not.toHaveBeenCalled();
  });

  it("同一冪等鍵已完成時回傳既有訂單且不再次扣款", async () => {
    prismaMock.order.findFirst.mockResolvedValueOnce({
      id: testOrderId,
      orderNumber: testCompletedOrderNumber,
      amountCents: 144000,
      status: "paid",
      payments: [
        {
          status: "succeeded",
          providerTradeId: "SANDBOX_EXISTING_TRADE_ID",
          failureMessage: null,
        },
      ],
    });

    await expect(
      createCheckoutOrder(testUserId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        idempotencyKey: testIdempotencyKey,
        paymentMethodId: testPaymentMethodId,
      }),
    ).resolves.toMatchObject({
      status: "succeeded",
      orderNumber: testCompletedOrderNumber,
      providerTradeId: "SANDBOX_EXISTING_TRADE_ID",
    });

    expect(prismaMock.paymentMethod.findFirst).not.toHaveBeenCalled();
    expect(processTapPaySandboxTokenPayment).not.toHaveBeenCalled();
    expect(prismaMock.order.create).not.toHaveBeenCalled();
  });

  it("同一冪等鍵仍在處理中時拒絕重複送出", async () => {
    prismaMock.order.findFirst.mockResolvedValueOnce({
      id: testOrderId,
      orderNumber: testPendingOrderNumber,
      amountCents: 144000,
      status: "pending",
      payments: [{ status: "pending" }],
    });

    await expect(
      createCheckoutOrder(testUserId, {
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        companyName: "SecureCart",
        billingEmail: "billing@example.com",
        billingAddress: "台北市信義區",
        idempotencyKey: testIdempotencyKey,
        paymentMethodId: testPaymentMethodId,
      }),
    ).rejects.toThrow("結帳正在處理中，請稍候再試。");

    expect(prismaMock.paymentMethod.findFirst).not.toHaveBeenCalled();
    expect(processTapPaySandboxTokenPayment).not.toHaveBeenCalled();
    expect(prismaMock.order.create).not.toHaveBeenCalled();
  });
});
