import { describe, expect, it } from "vitest";
import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";

describe("calculateCheckoutPricing", () => {
  it("計算月繳方案與產品總額", () => {
    expect(
      calculateCheckoutPricing({
        planId: "pro",
        productId: "codeguard",
        cycle: "monthly",
      }),
    ).toMatchObject({
      amountCents: 4800,
      currency: "USD",
      planName: "Pro",
      productName: "CodeGuard",
    });
  });

  it("計算年繳方案與產品總額", () => {
    expect(
      calculateCheckoutPricing({
        planId: "starter",
        productId: "deploywatch",
        cycle: "yearly",
      }),
    ).toMatchObject({
      amountCents: 24000,
      currency: "USD",
    });
  });

  it("拒絕無固定價格的企業方案", () => {
    expect(() =>
      calculateCheckoutPricing({
        planId: "enterprise",
        productId: "codeguard",
        cycle: "monthly",
      }),
    ).toThrow("企業方案需聯繫業務");
  });
});
