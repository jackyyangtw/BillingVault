"use server";

import { z } from "zod/v4";
import { verifySession } from "@/lib/auth/dal";
import { getTapPayCardBrand } from "@/features/payment-methods/cardBrand";
import { createPaymentMethod } from "@/features/payment-methods/dal/createPaymentMethod";
import { bindTapPaySandboxCard } from "@/features/payment-methods/payments/bindTapPaySandboxCard";

const createPaymentMethodSchema = z.object({
  prime: z.string().min(1),
  cardHolder: z.string().min(1),
  billingEmail: z.string().email(),
  card: z.object({
    binCode: z.string().length(6).optional(),
    last4: z.string().length(4).optional(),
    type: z.number().optional(),
    issuer: z.string().optional(),
    issuerZhTw: z.string().optional(),
    cardIdentifier: z.string().optional(),
    expMonth: z.number().int().min(1).max(12).optional(),
    expYear: z.number().int().min(2000).max(9999).optional(),
  }),
});

export async function createPaymentMethodAction(
  input: z.infer<typeof createPaymentMethodSchema>,
) {
  const { userId } = await verifySession();
  const parsed = createPaymentMethodSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("付款方式資料無效。");
  }

  const { card, billingEmail, cardHolder } = parsed.data;
  const brand = getTapPayCardBrand(card);
  const boundCard = await bindTapPaySandboxCard({
    prime: parsed.data.prime,
    cardholder: {
      name: cardHolder,
      email: billingEmail,
    },
  });
  const paymentMethod = await createPaymentMethod(userId, {
    brand: brand ?? card.issuer ?? card.issuerZhTw ?? "Card",
    binCode: card.binCode,
    last4: card.last4 ?? "0000",
    holder: cardHolder,
    billingEmail,
    cardIdentifier: card.cardIdentifier,
    providerCardKey: boundCard.providerCardKey,
    providerCardToken: boundCard.providerCardToken,
    expMonth: card.expMonth,
    expYear: card.expYear,
  });

  return {
    message: "Payment method has been saved.",
    paymentMethod,
  };
}
