import "server-only";

import { prisma } from "@/lib/prisma";

function isExpired(method: {
  expMonth: number | null;
  expYear: number | null;
}) {
  if (!method.expMonth || !method.expYear) {
    return false;
  }

  const expiresAt = new Date(method.expYear, method.expMonth, 0, 23, 59, 59);

  return expiresAt < new Date();
}

export async function setDefaultPaymentMethod(userId: string, id: string) {
  await prisma.$transaction(async (tx) => {
    const target = await tx.paymentMethod.findFirst({
      where: { id, userId },
      select: { id: true, expMonth: true, expYear: true },
    });

    if (!target) {
      throw new Error("Payment method not found.");
    }

    if (isExpired(target)) {
      throw new Error("Expired payment methods cannot be set as default.");
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
