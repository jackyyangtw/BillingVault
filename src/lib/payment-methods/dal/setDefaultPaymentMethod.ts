import "server-only";

import { prisma } from "@/lib/prisma";

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
