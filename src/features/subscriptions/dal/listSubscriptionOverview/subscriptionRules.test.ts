import { afterEach, describe, expect, it, vi } from "vitest";
import { testOrderId, testSubscriptionId, testUserId } from "@/test/testIds";
import { getCurrentSubscription, getIsExpiringSoon } from "./subscriptionRules";
import type { SubscriptionRecord } from "./subscriptionQuery";

function setNow() {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-06-03T00:00:00.000Z"));
}

function createSubscription(
  overrides: Partial<SubscriptionRecord> = {},
): SubscriptionRecord {
  const now = new Date("2026-06-03T00:00:00.000Z");

  return {
    id: testSubscriptionId,
    userId: testUserId,
    orderId: testOrderId,
    planId: "pro",
    productId: "deploywatch",
    cycle: "monthly",
    status: "active",
    currentPeriodStart: now,
    currentPeriodEnd: new Date("2026-07-03T00:00:00.000Z"),
    createdAt: now,
    updatedAt: now,
    order: {
      amountCents: 2900,
      status: "paid",
    },
    scheduledChanges: [],
    items: [],
    ...overrides,
  };
}

describe("subscription rules", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("選擇尚未到期的 active 訂閱作為目前訂閱", () => {
    setNow();

    const active = createSubscription({ id: "active" });

    expect(getCurrentSubscription([active])).toBe(active);
  });

  it("保留尚未到期的 canceled 訂閱作為目前訂閱", () => {
    setNow();

    const canceled = createSubscription({
      id: "canceled",
      status: "canceled",
    });

    expect(getCurrentSubscription([canceled])).toBe(canceled);
  });

  it("所有訂閱都已過期時回傳 null", () => {
    setNow();

    const expired = createSubscription({
      currentPeriodEnd: new Date("2026-06-02T23:59:59.000Z"),
    });

    expect(getCurrentSubscription([expired])).toBeNull();
  });

  it("同時有未到期訂閱時，優先選擇尚未取消的訂閱", () => {
    setNow();

    const canceled = createSubscription({
      id: "canceled",
      status: "canceled",
      currentPeriodEnd: new Date("2026-07-10T00:00:00.000Z"),
    });
    const active = createSubscription({
      id: "active",
      status: "active",
      currentPeriodEnd: new Date("2026-07-03T00:00:00.000Z"),
    });

    expect(getCurrentSubscription([canceled, active])).toBe(active);
  });

  it("標記七天內到期的 active 訂閱為快到期", () => {
    setNow();

    expect(
      getIsExpiringSoon(
        createSubscription({
          currentPeriodEnd: new Date("2026-06-10T00:00:00.000Z"),
        }),
      ),
    ).toBe(true);
  });

  it("不標記已取消、已過期或超過七天後到期的訂閱為快到期", () => {
    setNow();

    expect(
      getIsExpiringSoon(
        createSubscription({
          status: "canceled",
          currentPeriodEnd: new Date("2026-06-10T00:00:00.000Z"),
        }),
      ),
    ).toBe(false);
    expect(
      getIsExpiringSoon(
        createSubscription({
          currentPeriodEnd: new Date("2026-06-02T00:00:00.000Z"),
        }),
      ),
    ).toBe(false);
    expect(
      getIsExpiringSoon(
        createSubscription({
          currentPeriodEnd: new Date("2026-06-11T00:00:00.000Z"),
        }),
      ),
    ).toBe(false);
  });
});
