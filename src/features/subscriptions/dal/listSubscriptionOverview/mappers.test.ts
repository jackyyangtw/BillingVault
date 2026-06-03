import { afterEach, describe, expect, it, vi } from "vitest";
import { toCurrentSubscription, toSubscriptionRecord } from "./mappers";
import type { SubscriptionRecord } from "./subscriptionQuery";

function createSubscription(
  overrides: Partial<SubscriptionRecord> = {},
): SubscriptionRecord {
  const now = new Date("2026-06-03T00:00:00.000Z");

  return {
    id: "11111111-1111-4111-8111-111111111111",
    userId: "22222222-2222-4222-8222-222222222222",
    orderId: "33333333-3333-4333-8333-333333333333",
    planId: "business",
    productId: "deploywatch",
    cycle: "yearly",
    status: "active",
    currentPeriodStart: now,
    currentPeriodEnd: new Date("2026-06-10T00:00:00.000Z"),
    createdAt: now,
    updatedAt: now,
    order: {
      amountCents: 99000,
      status: "paid",
    },
    ...overrides,
  };
}

describe("subscription mappers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("將目前訂閱轉換成 UI 需要的資料", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T00:00:00.000Z"));

    expect(toCurrentSubscription(createSubscription())).toMatchObject({
      id: "11111111-1111-4111-8111-111111111111",
      planId: "business",
      planName: "Business",
      productName: "DeployWatch",
      status: "active",
      cycle: "yearly",
      seats: 25,
      renewalDate: "2026-06-10T00:00:00.000Z",
      nextInvoiceAmount: 990,
      trialDaysLeft: 0,
      isExpiringSoon: true,
    });
  });

  it("將訂閱紀錄轉換成帳務歷史資料", () => {
    const record = createSubscription();

    expect(toSubscriptionRecord(record, 0, [record])).toMatchObject({
      id: "SUB-11111111",
      date: "2026-06-03T00:00:00.000Z",
      amount: 990,
      status: "paid",
      planName: "Business",
      event: "created",
    });
  });

  it("方案不同時標記為方案變更事件", () => {
    const current = createSubscription({ planId: "business" });
    const previous = createSubscription({ planId: "pro" });

    expect(toSubscriptionRecord(current, 0, [current, previous])).toMatchObject(
      {
        event: "plan_change",
      },
    );
  });
});
