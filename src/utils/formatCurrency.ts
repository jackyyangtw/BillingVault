import { formatTwdAmount } from "@/lib/currency";

export function formatCurrency(amount: number) {
  return formatTwdAmount(amount);
}
