"use server";

import { z } from "zod/v4";
import { verifySession } from "@/lib/auth/dal";
import { deletePaymentMethod } from "@/features/payment-methods/dal/deletePaymentMethod";

const deletePaymentMethodSchema = z.object({
  id: z.string().uuid(),
});

export async function deletePaymentMethodAction(input: { id: string }) {
  const { userId } = await verifySession();
  const parsed = deletePaymentMethodSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("付款方式資料無效。");
  }

  await deletePaymentMethod(userId, parsed.data.id);

  return { message: "Payment method has been deleted." };
}
