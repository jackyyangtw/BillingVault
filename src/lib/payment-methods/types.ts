export type PaymentMethodStatus = "primary" | "backup" | "expired";

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  expiresAt: string;
  billingEmail: string;
  status: PaymentMethodStatus;
  tappayPrimeState: "ready" | "requires_refresh" | "unavailable";
};
