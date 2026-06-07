import { z } from "zod/v4";
import { products } from "@/mocks/fixtures/products";
import { plans } from "@/mocks/fixtures/plans";

const planIds = plans.map((plan) => plan.id);
const productIds = products.map((product) => product.id);

export const checkoutFormSchema = z.object({
  planId: z.string().refine((value) => planIds.includes(value), {
    message: "請選擇有效的訂閱方案",
  }),
  productIds: z
    .array(
      z.string().refine((value) => productIds.includes(value), {
        message: "請選擇有效的 SaaS 產品",
      }),
    )
    .min(1, "請至少選擇一個 SaaS 產品"),
  cycle: z.enum(["monthly", "yearly"], {
    message: "請選擇付款週期",
  }),
  companyName: z.string().min(1, "請輸入公司或團隊名稱"),
  billingEmail: z.string().email("請輸入有效的帳務 Email"),
  taxId: z.string().optional(),
  billingAddress: z.string().min(1, "請輸入帳單地址"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
