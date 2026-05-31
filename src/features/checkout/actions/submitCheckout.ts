"use server";

import { z } from "zod/v4";
import { verifySession } from "@/lib/auth/dal";
import { createCheckoutOrder } from "@/features/checkout/dal/createCheckoutOrder";
import { products } from "@/mocks/fixtures/products";
import { plans } from "@/mocks/fixtures/plans";

const planIds = plans.map((plan) => plan.id);
const productIds = products.map((product) => product.id);

const submitCheckoutSchema = z
  .object({
    planId: z.string().refine((value) => planIds.includes(value), {
      message: "請選擇有效的訂閱方案",
    }),
    productId: z.string().refine((value) => productIds.includes(value), {
      message: "請選擇有效的 SaaS 產品",
    }),
    cycle: z.enum(["monthly", "yearly"]),
    companyName: z.string().min(1),
    billingEmail: z.string().email(),
    taxId: z.string().optional(),
    billingAddress: z.string().min(1),
    prime: z.string().min(1).optional(),
    paymentMethodId: z.string().uuid().optional(),
    card: z
      .object({
        binCode: z.string().length(6).optional(),
        last4: z.string().length(4).optional(),
        type: z.number().optional(),
        issuer: z.string().optional(),
        issuerZhTw: z.string().optional(),
        cardIdentifier: z.string().optional(),
        expMonth: z.number().int().min(1).max(12).optional(),
        expYear: z.number().int().min(2000).max(9999).optional(),
      })
      .optional(),
    simulatePaymentFailure: z.boolean().optional(),
  })
  .refine((value) => value.prime || value.paymentMethodId, {
    message: "請選擇付款方式或輸入信用卡資料。",
  });

export type SubmitCheckoutInput = z.infer<typeof submitCheckoutSchema>;

export async function submitCheckoutAction(input: SubmitCheckoutInput) {
  const parsed = submitCheckoutSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("結帳資料無效。");
  }

  const { userId } = await verifySession();
  const result = await createCheckoutOrder(userId, parsed.data);

  if (result.status === "failed") {
    return {
      status: result.status,
      orderNumber: result.orderNumber,
      failureMessage: result.failureMessage ?? "TapPay sandbox 付款失敗。",
    };
  }

  return {
    status: result.status,
    orderNumber: result.orderNumber,
  };
}
