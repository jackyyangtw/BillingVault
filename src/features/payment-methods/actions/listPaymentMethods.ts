"use server";

import { verifySession } from "@/lib/auth/dal";
import { listPaymentMethods } from "@/features/payment-methods/dal/listPaymentMethods";

export async function listPaymentMethodsAction() {
  const { userId } = await verifySession();

  return listPaymentMethods(userId);
}
