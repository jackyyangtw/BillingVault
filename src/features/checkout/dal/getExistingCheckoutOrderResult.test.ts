import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  order: {
    findFirst: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  testFailedOrderNumber,
  testIdempotencyKey,
  testPaidOrderNumber,
  testUserId,
} from "@/test/testIds";
import { getExistingCheckoutOrderResult } from "./getExistingCheckoutOrderResult";

describe("既有結帳訂單查詢 Prisma DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("找不到相同冪等鍵訂單時回傳空值", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    await expect(
      getExistingCheckoutOrderResult(testUserId, testIdempotencyKey),
    ).resolves.toBeNull();

    expect(prismaMock.order.findFirst).toHaveBeenCalledWith({
      where: { userId: testUserId, idempotencyKey: testIdempotencyKey },
      include: {
        payments: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  });

  it("既有訂單仍在處理中時拒絕重複結帳", async () => {
    prismaMock.order.findFirst.mockResolvedValue({
      status: "pending",
      payments: [{ status: "pending" }],
    });

    await expect(
      getExistingCheckoutOrderResult(testUserId, testIdempotencyKey),
    ).rejects.toThrow("結帳正在處理中，請稍候再試。");
  });

  it("既有訂單付款失敗時回傳失敗結果", async () => {
    prismaMock.order.findFirst.mockResolvedValue({
      id: "order_failed",
      orderNumber: testFailedOrderNumber,
      amountCents: 4800,
      status: "failed",
      payments: [
        {
          status: "failed",
          providerTradeId: "SANDBOX_FAILED_TRADE_ID",
          failureMessage: "Insufficient funds",
        },
      ],
    });

    await expect(
      getExistingCheckoutOrderResult(testUserId, testIdempotencyKey),
    ).resolves.toEqual({
      status: "failed",
      orderId: "order_failed",
      orderNumber: testFailedOrderNumber,
      amountCents: 4800,
      currency: "twd",
      providerTradeId: "SANDBOX_FAILED_TRADE_ID",
      failureMessage: "Insufficient funds",
    });
  });

  it("既有訂單付款成功時回傳成功結果", async () => {
    prismaMock.order.findFirst.mockResolvedValue({
      id: "order_paid",
      orderNumber: testPaidOrderNumber,
      amountCents: 3540000,
      status: "paid",
      payments: [
        {
          status: "succeeded",
          providerTradeId: "SANDBOX_TRADE_ID",
        },
      ],
    });

    await expect(
      getExistingCheckoutOrderResult(testUserId, testIdempotencyKey),
    ).resolves.toEqual({
      status: "succeeded",
      orderId: "order_paid",
      orderNumber: testPaidOrderNumber,
      amountCents: 3540000,
      currency: "twd",
      providerTradeId: "SANDBOX_TRADE_ID",
    });
  });
});
