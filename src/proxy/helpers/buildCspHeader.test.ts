import { describe, it, expect } from "vitest";
import { buildCspHeader } from "../helpers/buildCspHeader";

describe("buildCspHeader", () => {
  it("產出的 CSP 包含 nonce", () => {
    const csp = buildCspHeader("test-nonce-123");

    expect(csp).toContain("nonce-test-nonce-123");
  });

  it("每次傳入不同 nonce，產出不同 CSP", () => {
    const csp1 = buildCspHeader("aaa");
    const csp2 = buildCspHeader("bbb");

    expect(csp1).toContain("nonce-aaa");
    expect(csp2).toContain("nonce-bbb");
    expect(csp1).not.toBe(csp2);
  });

  it("包含必要的安全指令", () => {
    const csp = buildCspHeader("nonce");

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("包含 TapPay 相關域名白名單", () => {
    const csp = buildCspHeader("nonce");

    expect(csp).toContain("https://js.tappaysdk.com");
    expect(csp).toContain("frame-src 'self' https://*.tappaysdk.com");
  });

  it("產出為單行字串（無多餘空白）", () => {
    const csp = buildCspHeader("nonce");

    expect(csp).not.toMatch(/\n/);
    expect(csp).not.toMatch(/\s{2,}/);
  });
});
