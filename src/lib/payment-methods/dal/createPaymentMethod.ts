import "server-only";

import { prisma } from "@/lib/prisma";
import { toPaymentMethod } from "./mapper";

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
