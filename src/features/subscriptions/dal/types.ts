import type { BillingCycle } from "@/mocks/fixtures/plans";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export type CurrentSubscriptionData = {
  id: string;
  planId: string;
  planName: string;
  productName: string;
  status: SubscriptionStatus;
  cycle: BillingCycle;
  seats: number;
  renewalDate: string;
  nextInvoiceAmount: number;
  trialDaysLeft: number;
  isExpiringSoon: boolean;
  scheduledChange: ScheduledSubscriptionChangeData | null;
};

export type ScheduledSubscriptionChangeData = {
  id: string;
  fromPlanName: string;
  toPlanId: string;
  toPlanName: string;
  effectiveAt: string;
};

export type SubscriptionRecordData = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "failed";
  productName: string;
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

export type SubscriptionOverview = {
  currentSubscription: CurrentSubscriptionData | null;
  planOptions: PlanOptionData[];
  subscriptionRecords: SubscriptionRecordData[];
};
