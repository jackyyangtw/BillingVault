import { getTapPayCardBrand } from "@/features/payment-methods/cardBrand";
import { prisma } from "@/lib/prisma";
import type { CreateCheckoutOrderInput } from "./createCheckoutOrderTypes";

export type CheckoutPaymentSource = Awaited<
  ReturnType<typeof getCheckoutPaymentSource>
>;

export async function getCheckoutPaymentSource(
  userId: string,
  input: CreateCheckoutOrderInput,
) {
  if (input.paymentMethodId) {
    return getSavedPaymentSource(userId, input.paymentMethodId);
  }

  if (!input.prime) {
    throw new Error("請選擇付款方式或輸入信用卡資料。");
  }

  return {
    type: "prime" as const,
    prime: input.prime,
    cardIdentifier: input.card?.cardIdentifier,
    last4: input.card?.last4,
    newPaymentMethod: input.card
      ? {
          brand: getTapPayCardBrand(input.card) ?? "Card",
          binCode: input.card.binCode,
          last4: input.card.last4 ?? "0000",
          holder: input.companyName,
          billingEmail: input.billingEmail,
          cardIdentifier: input.card.cardIdentifier,
          expMonth: input.card.expMonth,
          expYear: input.card.expYear,
        }
      : undefined,
  };
}

async function getSavedPaymentSource(userId: string, paymentMethodId: string) {
  const paymentMethod = await prisma.paymentMethod.findFirst({
    where: {
      id: paymentMethodId,
      userId,
    },
  });

  if (!paymentMethod) {
    throw new Error("找不到可用的付款方式。");
  }

  if (paymentMethod.tappayPrimeState !== "ready") {
    throw new Error("此付款方式需要重新綁定後才能使用。");
  }

  if (isExpiredPaymentMethod(paymentMethod)) {
    throw new Error("此付款方式已過期，請選擇其他卡片。");
  }

  if (!paymentMethod.providerCardKey || !paymentMethod.providerCardToken) {
    throw new Error("此卡片需要重新綁定後才能用於扣款。");
  }

  return {
    type: "token" as const,
    cardKey: paymentMethod.providerCardKey,
    cardToken: paymentMethod.providerCardToken,
    cardIdentifier: paymentMethod.cardIdentifier ?? undefined,
    last4: paymentMethod.last4,
  };
}

function isExpiredPaymentMethod(method: {
  expMonth: number | null;
  expYear: number | null;
}) {
  if (!method.expMonth || !method.expYear) {
    return false;
  }

  const expiresAt = new Date(method.expYear, method.expMonth, 0, 23, 59, 59);

  return expiresAt < new Date();
}
