import "server-only";

import { prisma } from "@/lib/prisma";

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
