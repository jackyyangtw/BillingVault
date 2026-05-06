import { z } from "zod";
import { products } from "@/mocks/fixtures/products";
import { plans } from "@/mocks/fixtures/plans";

const planIds = plans.map((plan) => plan.id);
const productIds = products.map((product) => product.id);

export const checkoutFormSchema = z.object({
  planId: z.string().refine((value) => planIds.includes(value), {
    message: "請選擇有效的訂閱方案",
  }),
  productId: z.string().refine((value) => productIds.includes(value), {
    message: "請選擇有效的 SaaS 產品",
  }),
  cycle: z.enum(["monthly", "yearly"], {
    message: "請選擇付款週期",
  }),
  companyName: z.string().min(1, "請輸入公司或團隊名稱"),
  billingEmail: z.string().email("請輸入有效的帳務 Email"),
  taxId: z.string().optional(),
  billingAddress: z.string().min(1, "請輸入帳單地址"),
  cardNumber: z.string().regex(/^(\d{4}\s?){4}$/, "請輸入 16 位測試卡號"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "格式需為 MM/YY"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "請輸入 3 到 4 位 CVC"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
