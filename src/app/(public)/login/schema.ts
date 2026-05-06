import { z } from "zod/v4";

export const loginFormSchema = z.object({
  email: z.string().trim().email("請輸入有效的 Email"),
  password: z.string().min(1, "請輸入密碼"),
  callbackUrl: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type LoginFormState = {
  fields: {
    email: string;
    callbackUrl: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export const initialLoginFormState: LoginFormState = {
  fields: {
    email: "",
    callbackUrl: "",
  },
};
