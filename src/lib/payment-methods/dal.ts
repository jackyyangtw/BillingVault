import "server-only";

import { cache } from "react";
import type { PaymentMethod as PrismaPaymentMethod } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaymentMethod, PaymentMethodStatus } from "./types";

type CreatePaymentMethodInput = {
  brand: string;
  last4: string;
  holder: string;
  billingEmail: string;
  cardIdentifier?: string;
  providerPaymentMethodId?: string;
  expMonth?: number;
  expYear?: number;
};

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

function toPaymentMethod(method: PrismaPaymentMethod): PaymentMethod {
  return {
    id: method.id,
    brand: method.brand,
    last4: method.last4,
    holder: method.holder,
    expiresAt: formatExpiresAt(method),
    billingEmail: method.billingEmail,
    status: getStatus(method),
    tappayPrimeState: method.tappayPrimeState,
  };
}

export const listPaymentMethods = cache(async (userId: string) => {
  const methods = await prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return methods.map(toPaymentMethod);
});

export async function createPaymentMethod(
  userId: string,
  input: CreatePaymentMethodInput,
) {
  const method = await prisma.$transaction(async (tx) => {
    const existingCount = await tx.paymentMethod.count({
      where: { userId },
    });
    const isDefault = existingCount === 0;

    return tx.paymentMethod.create({
      data: {
        userId,
        brand: input.brand,
        last4: input.last4,
        holder: input.holder,
        billingEmail: input.billingEmail,
        cardIdentifier: input.cardIdentifier,
        providerPaymentMethodId: input.providerPaymentMethodId,
        expMonth: input.expMonth,
        expYear: input.expYear,
        isDefault,
      },
    });
  });

  return toPaymentMethod(method);
}

export async function deletePaymentMethod(userId: string, id: string) {
  await prisma.$transaction(async (tx) => {
    const target = await tx.paymentMethod.findFirst({
      where: { id, userId },
      select: { id: true, isDefault: true },
    });

    if (!target) {
      throw new Error("Payment method not found.");
    }

    await tx.paymentMethod.delete({
      where: { id: target.id },
    });

    if (!target.isDefault) {
      return;
    }

    const nextDefault = await tx.paymentMethod.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (nextDefault) {
      await tx.paymentMethod.update({
        where: { id: nextDefault.id },
        data: { isDefault: true },
      });
    }
  });
}

export async function setDefaultPaymentMethod(userId: string, id: string) {
  await prisma.$transaction(async (tx) => {
    const target = await tx.paymentMethod.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!target) {
      throw new Error("Payment method not found.");
    }

    await tx.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    await tx.paymentMethod.update({
      where: { id },
      data: { isDefault: true },
    });
  });
}
