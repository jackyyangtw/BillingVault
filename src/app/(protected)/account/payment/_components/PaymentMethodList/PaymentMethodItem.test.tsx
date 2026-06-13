import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaymentMethod } from "@/features/payment-methods/dal/types";

vi.mock(
  "@/features/payment-methods/queries/useSetDefaultPaymentMethod",
  () => ({
    useSetDefaultPaymentMethod: () => ({
      isPending: false,
      mutate: vi.fn(),
    }),
  }),
);

vi.mock("@/features/payment-methods/queries/useDeletePaymentMethod", () => ({
  useDeletePaymentMethod: () => ({
    isPending: false,
    mutate: vi.fn(),
  }),
}));

import PaymentMethodItem from "./PaymentMethodItem";

function createPaymentMethod(
  overrides: Partial<PaymentMethod> = {},
): PaymentMethod {
  return {
    id: "payment-method-1",
    brand: "Visa",
    binCode: "424242",
    last4: "4242",
    holder: "BillingVault",
    expiresAt: "12/99",
    billingEmail: "billing@example.com",
    status: "primary",
    tappayPrimeState: "ready",
    ...overrides,
  };
}

describe("付款方式項目", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("預設卡只顯示卡片摘要，不顯示設定預設與操作選單", () => {
    render(<PaymentMethodItem method={createPaymentMethod()} />);

    expect(screen.getByText("Visa 424242 •••• 4242")).toBeInTheDocument();
    expect(screen.getByText("預設扣款")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "設為預設" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "卡片操作" }),
    ).not.toBeInTheDocument();
  });

  it("備援卡顯示設為預設與卡片操作", () => {
    render(
      <PaymentMethodItem
        method={createPaymentMethod({
          status: "backup",
        })}
      />,
    );

    expect(screen.getByText("備援卡")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "設為預設" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "卡片操作" })).toBeEnabled();
  });

  it("過期卡顯示狀態但不能設為預設", () => {
    render(
      <PaymentMethodItem
        method={createPaymentMethod({
          status: "expired",
          expiresAt: "01/26",
        })}
      />,
    );

    expect(screen.getByText("已過期")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "設為預設" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "卡片操作" })).toBeEnabled();
  });
});
