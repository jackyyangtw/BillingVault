import { beforeEach, describe, expect, it, vi } from "vitest";

const verifySessionMock = vi.hoisted(() => vi.fn());
const createPaymentMethodMock = vi.hoisted(() => vi.fn());
const bindTapPaySandboxCardMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth/dal", () => ({
  verifySession: verifySessionMock,
}));

vi.mock("@/features/payment-methods/dal/createPaymentMethod", () => ({
  createPaymentMethod: createPaymentMethodMock,
}));

vi.mock("@/features/payment-methods/payments/bindTapPaySandboxCard", () => ({
  bindTapPaySandboxCard: bindTapPaySandboxCardMock,
}));

import { createPaymentMethodAction } from "./createPaymentMethod";

const userId = "22222222-2222-4222-8222-222222222222";

describe("新增付款方式", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifySessionMock.mockResolvedValue({ userId });
    bindTapPaySandboxCardMock.mockResolvedValue({
      providerCardKey: "CARD_KEY",
      providerCardToken: "CARD_TOKEN",
    });
    createPaymentMethodMock.mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      brand: "Visa",
      last4: "4242",
    });
  });

  it("綁定 TapPay 卡片後保存可重複扣款 token", async () => {
    await expect(
      createPaymentMethodAction({
        prime: "test_prime",
        cardHolder: "SecureCart",
        billingEmail: "billing@example.com",
        card: {
          binCode: "424242",
          last4: "4242",
          type: 1,
          issuer: "Visa",
          cardIdentifier: "card_identifier",
          expMonth: 12,
          expYear: 2099,
        },
      }),
    ).resolves.toMatchObject({
      message: "Payment method has been saved.",
    });

    expect(bindTapPaySandboxCardMock).toHaveBeenCalledWith({
      prime: "test_prime",
      cardholder: {
        name: "SecureCart",
        email: "billing@example.com",
      },
    });
    expect(createPaymentMethodMock).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        brand: "Visa",
        last4: "4242",
        providerCardKey: "CARD_KEY",
        providerCardToken: "CARD_TOKEN",
      }),
    );
  });
});
