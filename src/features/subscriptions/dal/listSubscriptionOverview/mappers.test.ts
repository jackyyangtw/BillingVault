import { afterEach, describe, expect, it, vi } from "vitest";
import {
  testOrderId,
  testScheduledChangeId,
  testSubscriptionId,
  testUserId,
} from "@/test/testIds";
import { toCurrentSubscription, toSubscriptionRecord } from "./mappers";
import type { SubscriptionRecord } from "./subscriptionQuery";

function createSubscription(
  overrides: Partial<SubscriptionRecord> = {},
): SubscriptionRecord {
  const now = new Date("2026-06-03T00:00:00.000Z");

  return {
    id: testSubscriptionId,
    userId: testUserId,
    orderId: testOrderId,
    planId: "business",
    productId: "deploywatch",
    cycle: "yearly",
    status: "active",
    currentPeriodStart: now,
    currentPeriodEnd: new Date("2026-06-10T00:00:00.000Z"),
    createdAt: now,
    updatedAt: now,
    order: {
      amountCents: 3420000,
      status: "paid",
    },
    scheduledChanges: [],
    ...overrides,
  };
}

describe("訂閱資料轉換", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("將目前訂閱轉換成 UI 需要的資料", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T00:00:00.000Z"));

    expect(toCurrentSubscription(createSubscription())).toMatchObject({
      id: testSubscriptionId,
      planId: "business",
      planName: "Business",
      productName: "DeployWatch",
      status: "active",
      cycle: "yearly",
      seats: 25,
      renewalDate: "2026-06-10T00:00:00.000Z",
      nextInvoiceAmount: 34200,
      trialDaysLeft: 0,
      isExpiringSoon: true,
      scheduledChange: null,
    });
  });

  it("將待生效的降級排程轉換成目前訂閱提示", () => {
    const subscription = createSubscription({
      scheduledChanges: [
        {
          id: testScheduledChangeId,
          userId: testUserId,
          subscriptionId: testSubscriptionId,
          fromPlanId: "business",
          toPlanId: "pro",
          effectiveAt: new Date("2026-06-10T00:00:00.000Z"),
          status: "pending",
          createdAt: new Date("2026-06-03T00:00:00.000Z"),
          updatedAt: new Date("2026-06-03T00:00:00.000Z"),
        },
      ],
    });

    expect(toCurrentSubscription(subscription).scheduledChange).toMatchObject({
      id: testScheduledChangeId,
      fromPlanName: "Business",
      toPlanId: "pro",
      toPlanName: "Pro",
      effectiveAt: "2026-06-10T00:00:00.000Z",
    });
  });

  it("將訂閱紀錄轉換成帳務歷史資料", () => {
    const record = createSubscription();

    expect(toSubscriptionRecord(record, 0, [record])).toMatchObject({
      id: "SUB-11111111",
      date: "2026-06-03T00:00:00.000Z",
      amount: 34200,
      status: "paid",
      productName: "DeployWatch",
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
