"use server";

import { refresh } from "next/cache";
import { z } from "zod/v4";
import { verifySession } from "@/lib/auth/dal";
import { setDefaultPaymentMethod } from "@/lib/dals/payment-methods/setDefaultPaymentMethod";

const setDefaultPaymentMethodSchema = z.object({
  id: z.string().uuid(),
});

export async function setDefaultPaymentMethodAction(input: { id: string }) {
  const parsed = setDefaultPaymentMethodSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("付款方式資料無效。");
  }

  const { userId } = await verifySession();

  await setDefaultPaymentMethod(userId, parsed.data.id);
  refresh();

  return { message: "Payment method has been set as default." };
}
