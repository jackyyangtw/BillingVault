import { describe, expect, it } from "vitest";
import { formatDate } from "@/utils/formatDate";
import { getRecordStatusLabel } from "./getRecordStatusLabel";
import { getSubscriptionStatusLabel } from "./getSubscriptionStatusLabel";

describe("訂閱格式化工具", () => {
  it("將日期格式化為繁體中文日期與時間", () => {
    expect(formatDate("2026-05-30T16:24:00.000Z")).toBe("2026年5月31日 00:24");
  });

  it.each([
    ["trialing", "試用中"],
    ["active", "訂閱中"],
    ["past_due", "付款逾期"],
    ["canceled", "已取消續訂"],
    ["incomplete", "尚未完成"],
  ] as const)("將目前訂閱狀態 %s 轉換為 %s", (status, label) => {
    expect(getSubscriptionStatusLabel(status)).toBe(label);
  });

  it.each([
    ["paid", "已付款"],
    ["open", "待付款"],
    ["failed", "付款失敗"],
  ] as const)("將訂閱紀錄付款狀態 %s 轉換為 %s", (status, label) => {
    expect(getRecordStatusLabel(status)).toBe(label);
  });
});
