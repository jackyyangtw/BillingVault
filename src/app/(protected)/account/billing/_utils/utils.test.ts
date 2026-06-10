import { describe, expect, it } from "vitest";
import {
  formatDate,
  getInvoiceStatusLabel,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "./utils";

describe("帳務格式化工具", () => {
  it("將日期格式化為繁體中文日期與時間", () => {
    expect(formatDate("2026-06-06T09:32:00.000Z")).toBe("2026年6月6日 17:32");
  });

  it.each([
    ["paid", "已付款"],
    ["open", "待付款"],
    ["failed", "付款失敗"],
  ] as const)("將發票狀態 %s 轉換為 %s", (status, label) => {
    expect(getInvoiceStatusLabel(status)).toBe(label);
  });

  it.each([
    ["pending", "處理中"],
    ["paid", "已付款"],
    ["failed", "付款失敗"],
    ["canceled", "已取消"],
  ] as const)("將訂單狀態 %s 轉換為 %s", (status, label) => {
    expect(getOrderStatusLabel(status)).toBe(label);
  });

  it.each([
    ["pending", "等待授權"],
    ["succeeded", "授權成功"],
    ["failed", "授權失敗"],
  ] as const)("將付款授權狀態 %s 轉換為 %s", (status, label) => {
    expect(getPaymentStatusLabel(status)).toBe(label);
  });
});
