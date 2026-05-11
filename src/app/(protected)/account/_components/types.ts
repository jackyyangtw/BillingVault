export type BillingSummaryItem = {
  label: string;
  value: string;
  description: string;
};

export type InvoiceData = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "failed";
};
