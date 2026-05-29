"use server";

import { verifySession } from "@/lib/auth/dal";
import { listPaymentMethods } from "@/lib/dals/payment-methods/listPaymentMethods";

export async function listPaymentMethodsAction() {
  const { userId } = await verifySession();

  return listPaymentMethods(userId);
}
