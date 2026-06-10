import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CurrentSubscriptionData,
  PlanOptionData,
  SubscriptionRecordData,
} from "@/features/subscriptions/dal/types";
import { testScheduledChangeId, testSubscriptionId } from "@/test/testIds";
import CurrentSubscription from "../_components/CurrentSubscription";
import NoCurrentSubscription from "../_components/NoCurrentSubscription";
import PlanChangePanel from "../_components/PlanChangePanel";
import SubscriptionRecordHistory from "../_components/SubscriptionRecordHistory";

const changePlanMutateMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/subscriptions/queries/useChangeSubscriptionPlan", () => ({
  useChangeSubscriptionPlan: () => ({
    isPending: false,
    mutate: changePlanMutateMock,
  }),
}));

beforeEach(() => {
  changePlanMutateMock.mockClear();
});

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
            fromCycle: "monthly",
            toPlanId: "pro",
            toPlanName: "Pro",
            toCycle: "monthly",
            effectiveAt: "2026-07-01T00:00:00.000Z",
          },
        })}
      />,
    );

    expect(screen.getByText("已排程降級")).toBeInTheDocument();
    expect(screen.getAllByText(/將於 2026年7月1日.*改為 Pro/)).toHaveLength(2);
    expect(
      screen.getByText(/目前仍可使用 Business，將於.*起改為 Pro 月繳方案。/),
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

  it("升級為年繳後即使保留舊狀態也顯示年繳價格", () => {
    const { rerender } = render(
      <PlanChangePanel
        currentSubscriptionId={testSubscriptionId}
        currentPlanId="business"
        currentSubscriptionStatus="active"
        currentCycle="monthly"
        plans={createPlanOptions()}
      />,
    );

    expect(screen.getByText("NT$900")).toBeInTheDocument();

    rerender(
      <PlanChangePanel
        currentSubscriptionId={testSubscriptionId}
        currentPlanId="business"
        currentSubscriptionStatus="active"
        currentCycle="yearly"
        plans={createPlanOptions()}
      />,
    );

    expect(screen.getByText("NT$900")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "月繳" })).not.toBeDisabled();
  });

  it("在年繳頁籤升級時送出年繳週期", () => {
    render(
      <PlanChangePanel
        currentSubscriptionId={testSubscriptionId}
        currentPlanId="starter"
        currentSubscriptionStatus="active"
        currentCycle="monthly"
        plans={[
          {
            id: "starter",
            name: "Starter",
            priceMonthly: "NT$900",
            priceYearly: "NT$2,700",
            fit: "適合個人開發者",
            action: "current",
          },
          {
            id: "pro",
            name: "Pro",
            priceMonthly: "NT$2,900",
            priceYearly: "NT$8,700",
            fit: "適合快速成長的小團隊",
            action: "upgrade",
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "年繳" }));

    expect(screen.queryByText("目標方案")).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /升級/ })[1]);

    expect(changePlanMutateMock).toHaveBeenCalledWith(
      {
        subscriptionId: testSubscriptionId,
        planId: "pro",
        cycle: "yearly",
      },
      expect.any(Object),
    );
  });

  it("年繳方案可排程改回月繳週期並標示目標方案", () => {
    render(
      <PlanChangePanel
        currentSubscriptionId={testSubscriptionId}
        currentPlanId="business"
        currentSubscriptionStatus="active"
        currentCycle="yearly"
        plans={createPlanOptions()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "月繳" }));

    expect(screen.getByText("目標方案")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /降級/ })[1]);

    expect(changePlanMutateMock).toHaveBeenCalledWith(
      {
        subscriptionId: testSubscriptionId,
        planId: "business",
        cycle: "monthly",
      },
      expect.any(Object),
    );
  });
});
