import { describe, it, expect } from "vitest";
import { isSafeCallbackUrl } from "./isSafeCallbackUrl";

describe("isSafeCallbackUrl", () => {
  it.each([
    ["/account", true],
    ["/checkout?plan=pro", true],
    ["/account/settings", true],
    ["/", true],
  ])("安全路徑 %s → %s", (url, expected) => {
    expect(isSafeCallbackUrl(url)).toBe(expected);
  });

  it.each([
    ["https://evil.com", false],
    ["http://evil.com", false],
    ["//evil.com", false],
    ["/\\evil.com", false],
    ["javascript:alert(1)", false],
    ["data:text/html,<script>alert(1)</script>", false],
    ["", false],
  ])("危險路徑 %s → %s", (url, expected) => {
    expect(isSafeCallbackUrl(url)).toBe(expected);
  });
});
