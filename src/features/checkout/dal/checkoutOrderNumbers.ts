import { randomUUID } from "node:crypto";
import type { BillingCycle } from "@/mocks/fixtures/plans";

export function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();

  return `SC${date}${suffix}`;
}

export function createInvoiceNumber(orderNumber: string) {
  return `INV-${orderNumber}`;
}

export function getPeriodEnd(start: Date, cycle: BillingCycle) {
  const end = new Date(start);

  if (cycle === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }

  return end;
}
