import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaymentMethod } from "@/features/payment-methods/dal/types";

const usePaymentMethodsListQueryMock = vi.hoisted(() => vi.fn());

vi.mock(
  "@/features/payment-methods/queries/usePaymentMethodsListQuery",
  () => ({
    usePaymentMethodsListQuery: usePaymentMethodsListQueryMock,
  }),
);

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

import PaymentMethodList from "./index";

function createPaymentMethod(
  overrides: Partial<PaymentMethod> = {},
): PaymentMethod {
  return {
    id: "payment-method-1",
    brand: "Visa",
    binCode: "424242",
    last4: "4242",
    holder: "SecureCart",
    expiresAt: "12/99",
    billingEmail: "billing@example.com",
    status: "primary",
    tappayPrimeState: "ready",
    ...overrides,
  };
}

describe("付款方式列表", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("載入失敗時顯示錯誤提示", () => {
    usePaymentMethodsListQueryMock.mockReturnValue({
      data: undefined,
      isError: true,
      isPending: false,
    });

    render(<PaymentMethodList />);

    expect(
      screen.getByText("付款方式載入失敗，請稍後再試。"),
    ).toBeInTheDocument();
  });

  it("沒有卡片時顯示空狀態", () => {
    usePaymentMethodsListQueryMock.mockReturnValue({
      data: [],
      isError: false,
      isPending: false,
    });

    render(<PaymentMethodList />);

    expect(screen.getByText("目前沒有卡片")).toBeInTheDocument();
  });

  it("有卡片時顯示預設卡、備援卡與過期卡狀態", () => {
    usePaymentMethodsListQueryMock.mockReturnValue({
      data: [
        createPaymentMethod(),
        createPaymentMethod({
          id: "payment-method-2",
          brand: "Mastercard",
          last4: "8888",
          status: "backup",
          tappayPrimeState: "requires_refresh",
        }),
        createPaymentMethod({
          id: "payment-method-3",
          brand: "JCB",
          last4: "0005",
          status: "expired",
          tappayPrimeState: "unavailable",
        }),
      ],
      isError: false,
      isPending: false,
    });

    render(<PaymentMethodList />);

    expect(screen.getByText("Visa 424242 .... 4242")).toBeInTheDocument();
    expect(screen.getByText("Mastercard 424242 .... 8888")).toBeInTheDocument();
    expect(screen.getByText("JCB 424242 .... 0005")).toBeInTheDocument();
    expect(screen.getByText("預設扣款")).toBeInTheDocument();
    expect(screen.getByText("備援卡")).toBeInTheDocument();
    expect(screen.getByText("已過期")).toBeInTheDocument();
    expect(getElementByTextContent("TapPay prime 可用")).toBeInTheDocument();
    expect(getElementByTextContent("需要重新綁定")).toBeInTheDocument();
    expect(getElementByTextContent("尚未啟用")).toBeInTheDocument();
  });
});

function getElementByTextContent(text: string) {
  return screen.getByText(
    (_, element) =>
      element?.tagName === "P" && element.textContent?.includes(text) === true,
  );
}
