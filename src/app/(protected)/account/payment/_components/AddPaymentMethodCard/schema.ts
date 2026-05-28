import { z } from "zod/v4";

export const addPaymentFormSchema = z.object({
  cardHolder: z.string().min(1, "請輸入持卡人姓名"),
  billingEmail: z.string().email("請輸入有效的帳單 Email"),
});

export type AddPaymentFormValues = z.infer<typeof addPaymentFormSchema>;
