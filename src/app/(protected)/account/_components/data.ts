import type {
  BillingSummaryItem,
  CurrentSubscriptionData,
  InvoiceData,
  PlanOptionData,
} from "./types";

export const currentSubscription: CurrentSubscriptionData = {
  planId: "pro",
  planName: "Pro",
  productName: "CodeGuard",
  status: "active",
  cycle: "monthly",
  seats: 5,
  renewalDate: "2026-06-11",
  nextInvoiceAmount: 29,
  trialDaysLeft: 0,
};

export const billingSummary: BillingSummaryItem[] = [
  {
    label: "本月預估費用",
    value: "$29",
    description: "下一張帳單將依目前 Pro 月繳方案收費。",
  },
  {
    label: "付款狀態",
    value: "正常",
    description: "付款方式可用，沒有待處理的帳款。",
  },
  {
    label: "團隊席位",
    value: "5",
    description: "目前方案包含 5 個專案與優先支援。",
  },
];

export const invoices: InvoiceData[] = [
  {
    id: "INV-2026-006",
    date: "2026-05-11",
    amount: 29,
    status: "paid",
  },
  {
    id: "INV-2026-005",
    date: "2026-04-11",
    amount: 29,
    status: "paid",
  },
  {
    id: "INV-2026-004",
    date: "2026-03-11",
    amount: 29,
    status: "paid",
  },
];

export const planOptions: PlanOptionData[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$9/月",
    fit: "個人開發者與小型 side project",
    action: "downgrade",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/月",
    fit: "小團隊的安全掃描與通知流程",
    action: "current",
  },
  {
    id: "business",
    name: "Business",
    price: "$99/月",
    fit: "需要角色權限、稽核紀錄與 SSO 的團隊",
    action: "upgrade",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "洽詢報價",
    fit: "大型組織、客製 SLA 與專屬支援",
    action: "contact",
  },
];
