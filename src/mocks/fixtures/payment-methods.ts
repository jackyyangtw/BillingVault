export type PaymentMethodStatus = "primary" | "backup" | "expired";

export type PaymentMethod = {
  id: string;
  brand: "Visa" | "Mastercard" | "JCB";
  last4: string;
  holder: string;
  expiresAt: string;
  billingEmail: string;
  status: PaymentMethodStatus;
  tappayPrimeState: "ready" | "requires_refresh" | "unavailable";
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pm_card_visa_4242",
    brand: "Visa",
    last4: "4242",
    holder: "Lin Pin-An",
    expiresAt: "08/29",
    billingEmail: "billing@securecart.dev",
    status: "primary",
    tappayPrimeState: "ready",
  },
  {
    id: "pm_card_mastercard_1881",
    brand: "Mastercard",
    last4: "1881",
    holder: "SecureCart Team",
    expiresAt: "02/28",
    billingEmail: "finance@securecart.dev",
    status: "backup",
    tappayPrimeState: "ready",
  },
  {
    id: "pm_card_jcb_9012",
    brand: "JCB",
    last4: "9012",
    holder: "Lin Pin-An",
    expiresAt: "04/25",
    billingEmail: "billing@securecart.dev",
    status: "expired",
    tappayPrimeState: "requires_refresh",
  },
];

export function getPrimaryPaymentMethod() {
  return paymentMethods.find((method) => method.status === "primary");
}
