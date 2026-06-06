import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const txMock = vi.hoisted(() => ({
  subscription: {
    update: vi.fn(),
    create: vi.fn(),
  },
  subscriptionPlanChange: {
    updateMany: vi.fn(),
    create: vi.fn(),
  },
  order: {
    create: vi.fn(),
  },
  invoice: {
    create: vi.fn(),
  },
}));

const prismaMock = vi.hoisted(() => ({
  subscription: {
    findFirst: vi.fn(),
  },
  paymentMethod: {
    findFirst: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { changeSubscriptionPlan } from "./changeSubscriptionPlan";

const userId = "22222222-2222-4222-8222-222222222222";
const subscriptionId = "11111111-1111-4111-8111-111111111111";

describe("變更訂閱方案", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-16T00:00:00.000Z"));
    prismaMock.paymentMethod.findFirst.mockResolvedValue({
      cardIdentifier: "card_identifier",
      last4: "4242",
    });
    prismaMock.$transaction.mockImplementation(async (callback) =>
      callback(txMock),
    );
    txMock.order.create.mockResolvedValue({
      id: "33333333-3333-4333-8333-333333333333",
      payments: [{ id: "44444444-4444-4444-8444-444444444444" }],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("升級時立即建立補差額帳單並取消原本的有效訂閱", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue(
      createCurrentSubscription({ planId: "starter" }),
    );

    await expect(
      changeSubscriptionPlan(userId, {
        subscriptionId,
        planId: "pro",
      }),
    ).resolves.toEqual({ changeType: "upgrade" });

    expect(prismaMock.subscription.findFirst).toHaveBeenCalledWith({
      where: {
        id: subscriptionId,
        userId,
        status: { in: ["active", "trialing", "past_due"] },
        currentPeriodEnd: { gte: expect.any(Date) },
      },
      include: {
        order: {
          select: {
            companyName: true,
            billingEmail: true,
            billingAddress: true,
            taxId: true,
            productId: true,
          },
        },
      },
    });
    expect(txMock.subscription.update).toHaveBeenCalledWith({
      where: { id: subscriptionId },
      data: { status: "canceled" },
    });
    expect(txMock.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        amountCents: 30000,
        currency: "twd",
        status: "paid",
        payments: {
          create: expect.objectContaining({
            amountCents: 30000,
            currency: "twd",
            status: "succeeded",
            cardIdentifier: "card_identifier",
            cardLast4: "4242",
          }),
        },
      }),
      include: {
        payments: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    expect(txMock.invoice.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        orderId: "33333333-3333-4333-8333-333333333333",
        paymentRecordId: "44444444-4444-4444-8444-444444444444",
        amountCents: 30000,
        currency: "twd",
        status: "paid",
      }),
    });
    expect(txMock.subscription.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        orderId: "33333333-3333-4333-8333-333333333333",
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
        status: "active",
        currentPeriodEnd: new Date("2026-07-01T00:00:00.000Z"),
      }),
    });
    expect(txMock.subscriptionPlanChange.updateMany).toHaveBeenCalledWith({
      where: {
        subscriptionId,
        status: "pending",
      },
      data: { status: "canceled" },
    });
  });

  it("降級時只排程期末變更，不立即建立付款紀錄", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue(
      createCurrentSubscription({ planId: "business" }),
    );

    await expect(
      changeSubscriptionPlan(userId, {
        subscriptionId,
        planId: "pro",
      }),
    ).resolves.toEqual({ changeType: "downgrade" });

    expect(txMock.subscriptionPlanChange.updateMany).toHaveBeenCalledWith({
      where: {
        subscriptionId,
        status: "pending",
      },
      data: { status: "canceled" },
    });
    expect(txMock.subscriptionPlanChange.create).toHaveBeenCalledWith({
      data: {
        userId,
        subscriptionId,
        fromPlanId: "business",
        toPlanId: "pro",
        effectiveAt: new Date("2026-07-01T00:00:00.000Z"),
        status: "pending",
      },
    });
    expect(txMock.subscription.update).not.toHaveBeenCalled();
    expect(txMock.order.create).not.toHaveBeenCalled();
    expect(txMock.invoice.create).not.toHaveBeenCalled();
  });

  it("目標方案與目前方案相同時拒絕變更", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue(
      createCurrentSubscription({ planId: "pro" }),
    );

    await expect(
      changeSubscriptionPlan(userId, {
        subscriptionId,
        planId: "pro",
      }),
    ).rejects.toThrow("目標方案與目前方案相同。");

    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("企業方案需要聯絡銷售時拒絕直接變更", async () => {
    await expect(
      changeSubscriptionPlan(userId, {
        subscriptionId,
        planId: "enterprise",
      }),
    ).rejects.toThrow("企業方案需聯繫業務，無法直接變更。");

    expect(prismaMock.subscription.findFirst).not.toHaveBeenCalled();
  });

  it("訂閱不存在或不屬於目前使用者時拒絕變更", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue(null);

    await expect(
      changeSubscriptionPlan(userId, {
        subscriptionId,
        planId: "business",
      }),
    ).rejects.toThrow("找不到可變更的訂閱。");

    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });
});

function createCurrentSubscription({ planId }: { planId: string }) {
  return {
    id: subscriptionId,
    userId,
    orderId: "55555555-5555-4555-8555-555555555555",
    planId,
    productId: "codeguard",
    cycle: "monthly",
    status: "active",
    currentPeriodStart: new Date("2026-06-01T00:00:00.000Z"),
    currentPeriodEnd: new Date("2026-07-01T00:00:00.000Z"),
    createdAt: new Date("2026-06-01T00:00:00.000Z"),
    updatedAt: new Date("2026-06-01T00:00:00.000Z"),
    order: {
      companyName: "SecureCart",
      billingEmail: "billing@example.com",
      billingAddress: "台北市信義區",
      taxId: null,
      productId: "codeguard",
    },
  };
}
