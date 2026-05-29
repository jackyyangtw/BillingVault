export type BillingInvoice = {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "failed";
};

export type BillingOrder = {
  id: string;
  orderNumber: string;
  date: string;
  planName: string;
  productName: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "canceled";
  paymentStatus: "pending" | "succeeded" | "failed";
  providerTradeId?: string;
};

export type BillingOverview = {
  summary: {
    label: string;
    value: string;
    description: string;
  }[];
  invoices: BillingInvoice[];
  orders: BillingOrder[];
};
