import { describe, expect, it } from "vitest";
import { formatTwdAmount } from "@/lib/currency";

describe("台幣金額格式化", () => {
  it("顯示 NT 前綴避免誤認為美金", () => {
    expect(formatTwdAmount(570)).toBe("NT$570");
    expect(formatTwdAmount(1170)).toBe("NT$1,170");
  });
});
