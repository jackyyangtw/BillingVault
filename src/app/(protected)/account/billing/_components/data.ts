import type { BillingSummaryItem, InvoiceData } from "./types";

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
