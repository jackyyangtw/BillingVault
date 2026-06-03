import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  subscription: {
    findFirst: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { cancelSubscription } from "./cancelSubscription";

const userId = "22222222-2222-4222-8222-222222222222";
const subscriptionId = "11111111-1111-4111-8111-111111111111";

describe("cancelSubscription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("驗證訂閱所有權後，取消目前使用者所有尚未取消的訂閱", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue({ id: subscriptionId });
    prismaMock.subscription.updateMany.mockResolvedValue({ count: 2 });

    await expect(
      cancelSubscription(userId, subscriptionId),
    ).resolves.toBeUndefined();

    expect(prismaMock.subscription.findFirst).toHaveBeenCalledWith({
      where: {
        id: subscriptionId,
        userId,
        status: {
          not: "canceled",
        },
      },
      select: { id: true },
    });
    expect(prismaMock.subscription.updateMany).toHaveBeenCalledWith({
      where: {
        userId,
        status: {
          not: "canceled",
        },
      },
      data: {
        status: "canceled",
      },
    });
  });

  it("訂閱不存在、不屬於目前使用者或已取消時拒絕取消", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue(null);

    await expect(cancelSubscription(userId, subscriptionId)).rejects.toThrow(
      "找不到可取消的訂閱，或訂閱已經取消。",
    );

    expect(prismaMock.subscription.updateMany).not.toHaveBeenCalled();
  });

  it("所有權驗證後若沒有更新任何資料，仍拒絕取消", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue({ id: subscriptionId });
    prismaMock.subscription.updateMany.mockResolvedValue({ count: 0 });

    await expect(cancelSubscription(userId, subscriptionId)).rejects.toThrow(
      "找不到可取消的訂閱，或訂閱已經取消。",
    );
  });
});
