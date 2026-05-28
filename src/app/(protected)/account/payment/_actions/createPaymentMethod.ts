"use server";

import { z } from "zod/v4";
import { verifySession } from "@/lib/auth/dal";
import { createPaymentMethod } from "@/lib/payment-methods/dal/createPaymentMethod";

const createPaymentMethodSchema = z.object({
  prime: z.string().min(1),
  cardHolder: z.string().min(1),
  billingEmail: z.string().email(),
  card: z.object({
    last4: z.string().length(4).optional(),
    type: z.number().optional(),
    issuer: z.string().optional(),
    issuerZhTw: z.string().optional(),
    cardIdentifier: z.string().optional(),
    expMonth: z.number().int().min(1).max(12).optional(),
    expYear: z.number().int().min(2000).max(9999).optional(),
  }),
});

const cardBrandByType: Record<number, string> = {
  1: "Visa",
  2: "Mastercard",
  3: "JCB",
  4: "Union Pay",
  5: "AMEX",
};

export async function createPaymentMethodAction(
  input: z.infer<typeof createPaymentMethodSchema>,
) {
  const parsed = createPaymentMethodSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("付款方式資料無效。");
  }

  const { userId } = await verifySession();
  const { card, billingEmail, cardHolder } = parsed.data;
  const brand = card.type ? cardBrandByType[card.type] : undefined;
  const paymentMethod = await createPaymentMethod(userId, {
    brand: brand ?? card.issuer ?? card.issuerZhTw ?? "Card",
    last4: card.last4 ?? "0000",
    holder: cardHolder,
    billingEmail,
    cardIdentifier: card.cardIdentifier,
    expMonth: card.expMonth,
    expYear: card.expYear,
  });

  return {
    message: "Payment method has been saved.",
    paymentMethod,
  };
}
