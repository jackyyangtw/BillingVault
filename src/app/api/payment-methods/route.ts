import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/dal";

const bindPaymentMethodSchema = z.object({
  prime: z.string().min(1),
  cardHolder: z.string().min(1),
  billingEmail: z.string().email(),
  card: z.object({
    last4: z.string().optional(),
    type: z.number().optional(),
    issuer: z.string().optional(),
    issuerZhTw: z.string().optional(),
    cardIdentifier: z.string().optional(),
  }),
});

const cardBrandByType: Record<number, string> = {
  1: "Visa",
  2: "Mastercard",
  3: "JCB",
  4: "Union Pay",
  5: "AMEX",
};

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "請先登入後再綁定付款方式。" },
      {
        status: 401,
      },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bindPaymentMethodSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "付款方式資料格式不正確。" },
      {
        status: 400,
      },
    );
  }

  const { card, billingEmail, cardHolder } = parsed.data;
  const brand = card.type ? cardBrandByType[card.type] : undefined;

  return NextResponse.json(
    {
      message: "付款方式已完成模擬綁定。",
      paymentMethod: {
        id: `pm_mock_${crypto.randomUUID()}`,
        brand: brand ?? card.issuer ?? "Card",
        last4: card.last4 ?? "0000",
        holder: cardHolder,
        billingEmail,
        tappayPrimeState: "ready",
        cardIdentifier: card.cardIdentifier,
      },
    },
    {
      status: 201,
    },
  );
}
