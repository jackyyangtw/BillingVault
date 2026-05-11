export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export type BillingSummaryItem = {
  label: string;
  value: string;
  description: string;
};

export type CurrentSubscriptionData = {
  planId: string;
  planName: string;
  productName: string;
  status: SubscriptionStatus;
  cycle: "monthly" | "yearly";
  seats: number;
  renewalDate: string;
  nextInvoiceAmount: number;
  trialDaysLeft: number;
};

export type InvoiceData = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "failed";
};

export type PlanOptionData = {
  id: string;
  name: string;
  price: string;
  fit: string;
  action: "downgrade" | "current" | "upgrade" | "contact";
};
