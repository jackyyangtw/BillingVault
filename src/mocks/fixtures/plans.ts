import { formatTwdAmount } from "@/lib/currency";

export type BillingCycle = "monthly" | "yearly";

export type Plan = {
  id: string;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  cta: string;
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 270,
    yearlyPrice: 2700,
    description: "適合個人開發者",
    features: ["1 個專案", "基本分析報表", "Email 支援", "5 GB 儲存空間"],
    cta: "選擇 Starter",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 870,
    yearlyPrice: 8700,
    description: "適合快速成長的小團隊",
    features: [
      "5 個專案",
      "進階分析報表",
      "Webhook 警告通知",
      "50 GB 儲存空間",
      "優先技術支援",
    ],
    highlight: true,
    badge: "最多人選擇",
    cta: "立即開始",
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 2970,
    yearlyPrice: 29700,
    description: "適合規模化企業團隊",
    features: [
      "無限專案",
      "團隊角色與權限管理",
      "稽核紀錄",
      "500 GB 儲存空間",
      "專屬技術支援",
      "SSO 單一登入",
    ],
    cta: "選擇 Business",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "適合大型組織與合規要求",
    features: ["客製 SLA", "專屬支援窗口", "進階 SSO", "合規導入協助"],
    cta: "洽詢企業方案",
  },
];

export function formatPlanPrice(plan: Plan, cycle: BillingCycle) {
  const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  if (price === null) {
    return "洽詢報價";
  }

  return formatTwdAmount(price);
}

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}

export function isPlanDowngrade(
  currentPlanId: string | null | undefined,
  targetPlanId: string,
) {
  if (!currentPlanId) {
    return false;
  }

  const currentPlanIndex = plans.findIndex((plan) => plan.id === currentPlanId);
  const targetPlanIndex = plans.findIndex((plan) => plan.id === targetPlanId);

  return currentPlanIndex >= 0 && targetPlanIndex >= 0
    ? targetPlanIndex < currentPlanIndex
    : false;
}

export function getSelectablePlanId(
  targetPlanId: string,
  currentPlanId: string | null | undefined,
) {
  if (currentPlanId && isPlanDowngrade(currentPlanId, targetPlanId)) {
    return currentPlanId;
  }

  return targetPlanId;
}

export function isBillingCycleDowngrade(
  currentCycle: BillingCycle | null | undefined,
  targetCycle: BillingCycle,
) {
  return currentCycle === "yearly" && targetCycle === "monthly";
}

export function getSelectableBillingCycle(
  targetCycle: BillingCycle,
  currentCycle: BillingCycle | null | undefined,
) {
  return isBillingCycleDowngrade(currentCycle, targetCycle)
    ? "yearly"
    : targetCycle;
}
