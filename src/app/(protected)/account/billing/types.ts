import type {
  BillingInvoice,
  BillingOrder,
} from "@/features/billing/dal/types";

export type BillingSummaryItem = {
  label: string;
  value: string;
  description: string;
};

export type InvoiceData = BillingInvoice;

export type OrderData = BillingOrder;
