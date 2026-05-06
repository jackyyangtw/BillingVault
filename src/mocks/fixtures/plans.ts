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
    monthlyPrice: 9,
    yearlyPrice: 90,
    description: "適合個人開發者",
    features: ["1 個專案", "基本分析報表", "Email 支援", "5 GB 儲存空間"],
    cta: "免費開始試用",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 290,
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
    monthlyPrice: 99,
    yearlyPrice: 990,
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

  return `$${price}`;
}

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}
