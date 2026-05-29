import type { PaymentMethod as PrismaPaymentMethod } from "@/generated/prisma/client";
import type { PaymentMethod, PaymentMethodStatus } from "./types";

function isExpired(method: Pick<PrismaPaymentMethod, "expMonth" | "expYear">) {
  if (!method.expMonth || !method.expYear) {
    return false;
  }

  const expiresAt = new Date(method.expYear, method.expMonth, 0, 23, 59, 59);

  return expiresAt < new Date();
}

function getStatus(method: PrismaPaymentMethod): PaymentMethodStatus {
  if (isExpired(method)) {
    return "expired";
  }

  return method.isDefault ? "primary" : "backup";
}

function formatExpiresAt({
  expMonth,
  expYear,
}: Pick<PrismaPaymentMethod, "expMonth" | "expYear">) {
  if (!expMonth || !expYear) {
    return "Not provided";
  }

  return `${String(expMonth).padStart(2, "0")}/${String(expYear).slice(-2)}`;
}

export function toPaymentMethod(method: PrismaPaymentMethod): PaymentMethod {
  return {
    id: method.id,
    brand: method.brand,
    binCode: method.binCode ?? undefined,
    last4: method.last4,
    holder: method.holder,
    expiresAt: formatExpiresAt(method),
    billingEmail: method.billingEmail,
    status: getStatus(method),
    tappayPrimeState: method.tappayPrimeState,
  };
}
