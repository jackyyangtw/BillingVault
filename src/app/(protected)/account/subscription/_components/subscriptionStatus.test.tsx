import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  CurrentSubscriptionData,
  PlanOptionData,
  SubscriptionRecordData,
} from "@/features/subscriptions/dal/types";
import { testScheduledChangeId, testSubscriptionId } from "@/test/testIds";
import CurrentSubscription from "./CurrentSubscription";
import NoCurrentSubscription from "./NoCurrentSubscription";
import PlanChangePanel from "./PlanChangePanel";
import SubscriptionRecordHistory from "./SubscriptionRecordHistory";

vi.mock("@/features/subscriptions/queries/useChangeSubscriptionPlan", () => ({
  useChangeSubscriptionPlan: () => ({
    isPending: false,
    mutate: vi.fn(),
  }),
}));

function createSubscription(
  overrides: Partial<CurrentSubscriptionData> = {},
): CurrentSubscriptionData {
  return {
    id: testSubscriptionId,
    planId: "business",
    planName: "Business",
    productName: "CodeGuard",
    status: "active",
    cycle: "monthly",
    seats: 25,
    renewalDate: "2026-07-01T00:00:00.000Z",
    nextInvoiceAmount: 35400,
    trialDaysLeft: 0,
    isExpiringSoon: false,
    scheduledChange: null,
    ...overrides,
  };
}

function createRecord(
  overrides: Partial<SubscriptionRecordData> = {},
): SubscriptionRecordData {
  return {
    id: "SUB-11111111",
    date: "2026-06-06T10:30:00.000Z",
    amount: 35400,
    status: "paid",
    productName: "CodeGuard",
    planName: "Business",
    event: "created",
    ...overrides,
  };
}

function createPlanOptions(): PlanOptionData[] {
  return [
    {
      id: "starter",
      name: "Starter",
      priceMonthly: "NT$900",
      priceYearly: "NT$2,700",
      fit: "適合個人開發者",
      action: "downgrade",
    },
    {
      id: "business",
      name: "Business",
      priceMonthly: "NT$9,900",
      priceYearly: "NT$29,700",
      fit: "適合規模化企業團隊",
      action: "current",
    },
  ];
}

describe("訂閱狀態 UI", () => {
  it("訂閱中時顯示目前方案、續訂日與下期金額", () => {
    render(<CurrentSubscription subscription={createSubscription()} />);

    expect(screen.getByText("目前訂閱狀態")).toBeInTheDocument();
    expect(screen.getByText("訂閱中")).toBeInTheDocument();
    expect(screen.getByText("目前方案")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("下次續訂日")).toBeInTheDocument();
    expect(screen.getByText("預計收取 NT$35,400")).toBeInTheDocument();
    expect(screen.getByText("25 席")).toBeInTheDocument();
  });

  it("快到期訂閱會優先顯示快到期狀態", () => {
    render(
      <CurrentSubscription
        subscription={createSubscription({ isExpiringSoon: true })}
      />,
    );

    expect(screen.getByText("快到期")).toBeInTheDocument();
    expect(screen.queryByText("訂閱中")).not.toBeInTheDocument();
  });

  it("已取消續訂時顯示可使用期限與停止續訂提示", () => {
    render(
      <CurrentSubscription
        subscription={createSubscription({ status: "canceled" })}
      />,
    );

    expect(screen.getByText("已取消續訂")).toBeInTheDocument();
    expect(screen.getByText("可使用至")).toBeInTheDocument();
    expect(screen.getByText("到期後將停止續訂")).toBeInTheDocument();
    expect(
      screen.getByText(
        /CodeGuard 已取消續訂，仍可使用 Business 方案至 2026年7月1日/,
      ),
    ).toBeInTheDocument();
  });

  it("已取消訂閱時升級降級區塊提示到期後重新訂閱", () => {
    render(
      <PlanChangePanel
        currentSubscriptionId={testSubscriptionId}
        currentPlanId="business"
        currentSubscriptionStatus="canceled"
        currentCycle="yearly"
        plans={createPlanOptions()}
      />,
    );

    expect(screen.getByText("請於訂閱到期後再重新訂閱。")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /降級/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /目前方案/ }),
    ).not.toBeInTheDocument();
  });

  it("有待生效降級時顯示排程提示與目標方案", () => {
    render(
      <CurrentSubscription
        subscription={createSubscription({
          scheduledChange: {
            id: testScheduledChangeId,
            fromPlanName: "Business",
            toPlanId: "pro",
            toPlanName: "Pro",
            effectiveAt: "2026-07-01T00:00:00.000Z",
          },
        })}
      />,
    );

    expect(screen.getByText("已排程降級")).toBeInTheDocument();
    expect(screen.getAllByText(/將於 2026年7月1日.*改為 Pro/)).toHaveLength(2);
    expect(
      screen.getByText(/目前仍可使用 Business，將於.*起改為 Pro。/),
    ).toBeInTheDocument();
  });

  it("沒有目前訂閱時顯示空狀態與結帳入口", () => {
    render(<NoCurrentSubscription />);

    expect(screen.getByText("目前沒有訂閱")).toBeInTheDocument();
    expect(screen.getByText("選擇方案並完成付款")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "前往結帳" })).toHaveAttribute(
      "href",
      "/checkout",
    );
  });

  it("沒有訂閱紀錄時顯示紀錄空狀態", () => {
    render(<SubscriptionRecordHistory records={[]} />);

    expect(screen.getByText("訂閱紀錄")).toBeInTheDocument();
    expect(screen.getByText("尚無訂閱紀錄")).toBeInTheDocument();
  });

  it("訂閱紀錄顯示產品、方案、事件、付款狀態與金額", () => {
    render(
      <SubscriptionRecordHistory
        records={[
          createRecord(),
          createRecord({
            id: "SUB-22222222",
            amount: 14400,
            status: "open",
            productName: "DeployWatch",
            planName: "Pro",
            event: "plan_change",
          }),
          createRecord({
            id: "SUB-33333333",
            amount: 4800,
            status: "failed",
            planName: "Starter",
            event: "renewal",
          }),
        ]}
      />,
    );

    expect(screen.getByText(/CodeGuard · Business ·/)).toBeInTheDocument();
    expect(screen.getByText(/DeployWatch · Pro ·/)).toBeInTheDocument();
    expect(screen.getByText("建立訂閱")).toBeInTheDocument();
    expect(screen.getByText("方案變更")).toBeInTheDocument();
    expect(screen.getByText("續訂")).toBeInTheDocument();
    expect(screen.getByText("已付款")).toBeInTheDocument();
    expect(screen.getByText("待付款")).toBeInTheDocument();
    expect(screen.getByText("付款失敗")).toBeInTheDocument();
    expect(screen.getByText("NT$35,400")).toBeInTheDocument();
    expect(screen.getByText("NT$14,400")).toBeInTheDocument();
    expect(screen.getByText("NT$4,800")).toBeInTheDocument();
  });

  it("訂閱紀錄事件標籤使用更明顯的狀態色", () => {
    render(
      <SubscriptionRecordHistory
        records={[
          createRecord(),
          createRecord({
            id: "SUB-22222222",
            event: "plan_change",
          }),
          createRecord({
            id: "SUB-33333333",
            event: "renewal",
          }),
        ]}
      />,
    );

    expect(screen.getByText("建立訂閱")).toHaveClass(
      "bg-violet-500/12",
      "text-violet-200",
      "font-semibold",
    );
    expect(screen.getByText("方案變更")).toHaveClass(
      "bg-sky-500/15",
      "text-sky-200",
      "font-semibold",
    );
    expect(screen.getByText("續訂")).toHaveClass(
      "bg-emerald-500/12",
      "text-emerald-200",
      "font-semibold",
    );
  });
});
