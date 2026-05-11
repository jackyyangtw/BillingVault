export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

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

export type SubscriptionRecordData = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "failed";
  planName: string;
  event: "renewal" | "created" | "plan_change";
};

export type PlanOptionData = {
  id: string;
  name: string;
  price: string;
  fit: string;
  action: "downgrade" | "current" | "upgrade" | "contact";
};
