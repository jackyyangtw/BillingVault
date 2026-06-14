import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("日期格式化", () => {
  it("將 UTC 時間顯示為台灣時間", () => {
    expect(formatDate("2026-06-14T06:16:00.000Z")).toBe("2026年6月14日 14:16");
  });
});
