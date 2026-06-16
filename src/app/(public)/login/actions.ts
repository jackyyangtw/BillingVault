"use server";

import { redirect } from "next/navigation";
import { isSafeCallbackUrl } from "@/proxy/helpers/isSafeCallbackUrl";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginFormSchema, type LoginFormState } from "./schema";

const DEFAULT_LOGIN_REDIRECT = "/account/billing";

function resolveCallbackUrl(value: string | undefined): string {
  if (!value) return DEFAULT_LOGIN_REDIRECT;
  return isSafeCallbackUrl(value) ? value : DEFAULT_LOGIN_REDIRECT;
}

function getDemoCredentials(): {
  email: string;
  password: string;
} | null {
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

async function signInWithPassword(
  email: string,
  password: string,
  callbackUrl: string | undefined,
  returnedEmail = email,
): Promise<LoginFormState> {
  if (!getSupabaseEnv()) {
    return {
      fields: {
        email: returnedEmail,
        callbackUrl: callbackUrl ?? "",
      },
      message: "Supabase 尚未設定，請先補上環境變數。",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      fields: {
        email: returnedEmail,
        callbackUrl: callbackUrl ?? "",
      },
      message: "帳號或密碼錯誤，請確認測試帳號後再試。",
    };
  }

  redirect(resolveCallbackUrl(callbackUrl));
}

// Public login entrypoint: unauthenticated users must be allowed to call it.
// react-doctor-disable-next-line react-doctor/server-auth-actions
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

  return signInWithPassword(email, password, callbackUrl);
}

// Public demo login entrypoint: credentials stay on the server.
// react-doctor-disable-next-line react-doctor/server-auth-actions
export async function demoLoginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const callbackUrlValue = formData.get("callbackUrl");
  const callbackUrl =
    typeof callbackUrlValue === "string" ? callbackUrlValue : undefined;
  const credentials = getDemoCredentials();

  if (!credentials) {
    return {
      fields: {
        email: "",
        callbackUrl: callbackUrl ?? "",
      },
      message: "Demo 帳號尚未設定，請補上 DEMO_EMAIL 與 DEMO_PASSWORD。",
    };
  }

  return signInWithPassword(
    credentials.email,
    credentials.password,
    callbackUrl,
    "",
  );
}
