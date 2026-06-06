import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  order: {
    findFirst: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { testPaidOrderNumber, testUserId } from "@/test/testIds";
import { getCheckoutFailureDetails } from "./getCheckoutFailureDetails";
import { getCheckoutSuccessDetails } from "./getCheckoutSuccessDetails";

describe("結帳結果頁 Prisma DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("成功頁查詢不到訂單時回傳空值", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    await expect(
      getCheckoutSuccessDetails(testUserId, testPaidOrderNumber),
    ).resolves.toBeNull();
  });

  it("成功頁只回傳商品方案金額與購買時間 DTO", async () => {
    prismaMock.order.findFirst.mockResolvedValue({
      orderNumber: testPaidOrderNumber,
      planId: "business",
      productId: "codeguard",
      amountCents: 3540000,
      createdAt: new Date("2026-06-06T10:30:00.000Z"),
    });

    await expect(
      getCheckoutSuccessDetails(testUserId, testPaidOrderNumber),
    ).resolves.toEqual({
      orderNumber: testPaidOrderNumber,
      amount: "NT$35,400",
      productName: "CodeGuard",
      planName: "Business",
      purchasedAt: "2026年6月6日 18:30",
    });

    expect(prismaMock.order.findFirst).toHaveBeenCalledWith({
      where: { userId: testUserId, orderNumber: testPaidOrderNumber },
      select: {
        orderNumber: true,
        planId: true,
        productId: true,
        amountCents: true,
        createdAt: true,
      },
    });
  });

  it("失敗頁沒有付款紀錄時回傳空值", async () => {
    prismaMock.order.findFirst.mockResolvedValue({
      payments: [],
    });

    await expect(
      getCheckoutFailureDetails(testUserId, testPaidOrderNumber),
    ).resolves.toBeNull();
  });

  it("失敗頁只回傳最近一筆付款錯誤資訊", async () => {
    prismaMock.order.findFirst.mockResolvedValue({
      payments: [
        {
          providerStatusCode: "2001",
          providerMessage: "Payment failed",
          failureCode: "card_declined",
          failureMessage: "Card declined",
        },
      ],
    });

    await expect(
      getCheckoutFailureDetails(testUserId, testPaidOrderNumber),
    ).resolves.toEqual({
      providerStatusCode: "2001",
      providerMessage: "Payment failed",
      failureCode: "card_declined",
      failureMessage: "Card declined",
    });

    expect(prismaMock.order.findFirst).toHaveBeenCalledWith({
      where: { userId: testUserId, orderNumber: testPaidOrderNumber },
      select: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            providerStatusCode: true,
            providerMessage: true,
            failureCode: true,
            failureMessage: true,
          },
        },
      },
    });
  });
});
