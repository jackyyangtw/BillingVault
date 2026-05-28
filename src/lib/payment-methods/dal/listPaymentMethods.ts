import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { toPaymentMethod } from "./mapper";

export const listPaymentMethods = cache(async (userId: string) => {
  const methods = await prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return methods.map(toPaymentMethod);
});
