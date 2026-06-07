import { describe, expect, it } from "vitest";
import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";

describe("計算結帳價格", () => {
  it("計算月繳方案與產品總額", () => {
    expect(
      calculateCheckoutPricing({
        planId: "pro",
        productIds: ["codeguard"],
        cycle: "monthly",
      }),
    ).toMatchObject({
      amountCents: 144000,
      currency: "twd",
      planName: "Pro",
      productName: "CodeGuard",
    });
  });

  it("計算年繳方案與產品總額", () => {
    expect(
      calculateCheckoutPricing({
        planId: "starter",
        productIds: ["deploywatch"],
        cycle: "yearly",
      }),
    ).toMatchObject({
      amountCents: 720000,
      currency: "twd",
    });
  });

  it("拒絕無固定價格的企業方案", () => {
    expect(() =>
      calculateCheckoutPricing({
        planId: "enterprise",
        productIds: ["codeguard"],
        cycle: "monthly",
      }),
    ).toThrow("企業方案需聯繫業務");
  });

  it("計算多個 SaaS 產品總額", () => {
    expect(
      calculateCheckoutPricing({
        planId: "pro",
        productIds: ["codeguard", "deploywatch"],
        cycle: "monthly",
      }),
    ).toMatchObject({
      amountCents: 189000,
      productName: "CodeGuard、DeployWatch",
      productNames: ["CodeGuard", "DeployWatch"],
      productLineItems: [
        {
          productId: "codeguard",
          productName: "CodeGuard",
          amountCents: 57000,
        },
        {
          productId: "deploywatch",
          productName: "DeployWatch",
          amountCents: 45000,
        },
      ],
    });
  });
});
