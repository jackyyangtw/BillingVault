export const appCurrency = "twd" as const;
export const tappayCurrency = "TWD" as const;

const twdFormatter = new Intl.NumberFormat("zh-TW", {
  maximumFractionDigits: 0,
});

export function formatTwdAmount(amount: number) {
  return `NT$${twdFormatter.format(amount)}`;
}

export function centsToTwdAmount(amountCents: number) {
  return amountCents / 100;
}

export function twdAmountToCents(amount: number) {
  return amount * 100;
}

export function centsToTapPayAmount(amountCents: number) {
  return Math.round(centsToTwdAmount(amountCents));
}
