import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { beforeAll, describe, expect, it } from "vitest";
import type { BillingCycle } from "@/mocks/plans";
import PlanSelector from "./PlanSelector";
import type { CheckoutFormValues } from "./schema";

type TestPlanSelectorProps = {
  currentPlanId: string | null;
  currentCycle: BillingCycle | null;
};

function TestPlanSelector({
  currentPlanId,
  currentCycle,
}: TestPlanSelectorProps) {
  const form = useForm<CheckoutFormValues>({
    defaultValues: {
      planId: "business",
      productIds: ["codeguard"],
      cycle: currentCycle ?? "monthly",
      companyName: "BillingVault",
      billingEmail: "billing@example.com",
      taxId: "",
      billingAddress: "台北市信義區",
    },
  });

  return (
    <FormProvider {...form}>
      <PlanSelector currentPlanId={currentPlanId} currentCycle={currentCycle} />
    </FormProvider>
  );
}

beforeAll(() => {
  HTMLElement.prototype.hasPointerCapture ??= () => false;
  HTMLElement.prototype.setPointerCapture ??= () => undefined;
  HTMLElement.prototype.releasePointerCapture ??= () => undefined;
  HTMLElement.prototype.scrollIntoView ??= () => undefined;
});

describe("結帳方案選擇", () => {
  it("可以同時選擇多個 SaaS 產品", () => {
    render(<TestPlanSelector currentPlanId={null} currentCycle={null} />);

    const codeGuard = screen.getByRole("checkbox", { name: /CodeGuard/ });
    const deployWatch = screen.getByRole("checkbox", { name: /DeployWatch/ });

    expect(codeGuard).toBeChecked();
    expect(deployWatch).not.toBeChecked();

    fireEvent.click(deployWatch);

    expect(codeGuard).toBeChecked();
    expect(deployWatch).toBeChecked();
  });

  it("結帳方案不顯示 Enterprise", async () => {
    render(<TestPlanSelector currentPlanId={null} currentCycle={null} />);

    fireEvent.pointerDown(screen.getByRole("combobox", { name: "訂閱方案" }), {
      button: 0,
      ctrlKey: false,
      pointerType: "mouse",
    });

    expect(
      await screen.findByRole("option", { name: "Starter" }),
    ).toBeVisible();
    expect(screen.queryByRole("option", { name: "Enterprise" })).toBeNull();
  });

  it("目前已有 Business 方案時顯示訂閱管理提示", () => {
    render(<TestPlanSelector currentPlanId="business" currentCycle={null} />);

    expect(screen.getByText("Business")).toBeVisible();
    expect(screen.getByText(/若要更換方案/)).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "訂閱管理" })[0],
    ).toHaveAttribute("href", "/account/subscription");
  });

  it("沒有訂閱時可以選擇付款週期", async () => {
    render(<TestPlanSelector currentPlanId={null} currentCycle={null} />);

    fireEvent.pointerDown(screen.getByRole("combobox", { name: "付款週期" }), {
      button: 0,
      ctrlKey: false,
      pointerType: "mouse",
    });

    expect(await screen.findByRole("option", { name: "月繳" })).toBeVisible();
    expect(screen.getByRole("option", { name: "年繳" })).toBeVisible();
  });

  it("沒有訂閱時不顯示訂閱限制提示", () => {
    render(<TestPlanSelector currentPlanId={null} currentCycle={null} />);

    expect(
      screen.queryByText(/可購買已有商品是正常現象/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/如要更改訂閱週期/)).not.toBeInTheDocument();
  });

  it("已有訂閱時付款週期只顯示目前值", () => {
    render(<TestPlanSelector currentPlanId="business" currentCycle="yearly" />);

    expect(
      screen.queryByRole("combobox", { name: "付款週期" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("年繳")).toBeVisible();
  });

  it("已有訂閱時顯示訂閱限制提示", () => {
    render(<TestPlanSelector currentPlanId="business" currentCycle="yearly" />);

    expect(screen.getByText(/可購買已有商品是正常現象/)).toBeInTheDocument();
    expect(screen.getByText(/如要更改訂閱週期/)).toBeInTheDocument();
  });
});
