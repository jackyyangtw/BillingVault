"use server";

import { redirect } from "next/navigation";
import { loginAPI } from "@/lib/auth/api";
import { createSession } from "@/lib/auth/session";
import { isSafeCallbackUrl } from "@/proxy/isSafeCallbackUrl";
import { loginFormSchema, type LoginFormState } from "./schema";

const DEFAULT_LOGIN_REDIRECT = "/checkout";

function resolveCallbackUrl(value: string | undefined): string {
  if (!value) return DEFAULT_LOGIN_REDIRECT;
  return isSafeCallbackUrl(value) ? value : DEFAULT_LOGIN_REDIRECT;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const rawFields = {
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: formData.get("callbackUrl") || undefined,
  };
  const parsed = loginFormSchema.safeParse(rawFields);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      fields: {
        email: typeof rawFields.email === "string" ? rawFields.email : "",
        callbackUrl:
          typeof rawFields.callbackUrl === "string"
            ? rawFields.callbackUrl
            : "",
      },
      errors: {
        email: errors.email,
        password: errors.password,
      },
      message: "請確認登入資料後再送出。",
    };
  }

  const { email, password, callbackUrl } = parsed.data;
  const response = await loginAPI(email, password);

  if (!response.success || !response.token) {
    return {
      fields: {
        email,
        callbackUrl: callbackUrl ?? "",
      },
      message: response.error ?? "登入失敗，請稍後再試。",
    };
  }

  await createSession(response.token);
  redirect(resolveCallbackUrl(callbackUrl));
}
