import { beforeEach, describe, expect, it, vi } from "vitest";

const txMock = vi.hoisted(() => ({
  subscription: {
    updateMany: vi.fn(),
  },
  subscriptionPlanChange: {
    updateMany: vi.fn(),
  },
}));

const prismaMock = vi.hoisted(() => ({
  subscription: {
    findFirst: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { testSubscriptionId, testUserId } from "@/test/testIds";
import { cancelSubscription } from "./cancelSubscription";

describe("取消訂閱 Prisma DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (callback) =>
      callback(txMock),
    );
  });

  it("驗證訂閱所有權後，取消目前使用者所有尚未取消的訂閱", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue({
      id: testSubscriptionId,
    });
    txMock.subscription.updateMany.mockResolvedValue({ count: 2 });
    txMock.subscriptionPlanChange.updateMany.mockResolvedValue({ count: 1 });

    await expect(
      cancelSubscription(testUserId, testSubscriptionId),
    ).resolves.toBeUndefined();

    expect(prismaMock.subscription.findFirst).toHaveBeenCalledWith({
      where: {
        id: testSubscriptionId,
        userId: testUserId,
        status: {
          not: "canceled",
        },
      },
      select: { id: true },
    });
    expect(txMock.subscription.updateMany).toHaveBeenCalledWith({
      where: {
        userId: testUserId,
        status: {
          not: "canceled",
        },
      },
      data: {
        status: "canceled",
      },
    });
    expect(txMock.subscriptionPlanChange.updateMany).toHaveBeenCalledWith({
      where: {
        userId: testUserId,
        status: "pending",
      },
      data: {
        status: "canceled",
      },
    });
  });

  it("訂閱不存在、不屬於目前使用者或已取消時拒絕取消", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue(null);

    await expect(
      cancelSubscription(testUserId, testSubscriptionId),
    ).rejects.toThrow("找不到可取消的訂閱，或訂閱已經取消。");

    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("所有權驗證後若沒有更新任何資料，仍拒絕取消", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue({
      id: testSubscriptionId,
    });
    txMock.subscription.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      cancelSubscription(testUserId, testSubscriptionId),
    ).rejects.toThrow("找不到可取消的訂閱，或訂閱已經取消。");
    expect(txMock.subscriptionPlanChange.updateMany).not.toHaveBeenCalled();
  });
});
