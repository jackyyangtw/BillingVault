"use client";

import Link from "next/link";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ShieldCheck } from "lucide-react";
import { startTransition, useActionState } from "react";
import type { BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { demoLoginAction, loginAction } from "../../actions";
import {
  initialLoginFormState,
  loginFormSchema,
  type LoginFormValues,
} from "../../schema";
import DemoAccessPanel from "../DemoAccessPanel";
import LoginFormActions from "./LoginFormActions";
import LoginFormFields from "./LoginFormFields";

type LoginFormProps = {
  callbackUrl: string;
};

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialLoginFormState,
  );
  const [demoState, demoFormAction, demoPending] = useActionState(
    demoLoginAction,
    initialLoginFormState,
  );
  const resolvedCallbackUrl = state.fields.callbackUrl || callbackUrl;
  const resolvedDemoCallbackUrl = demoState.fields.callbackUrl || callbackUrl;

  const form = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginFormSchema),
    mode: "onTouched",
    defaultValues: {
      email: state.fields.email,
      password: "",
      callbackUrl: resolvedCallbackUrl,
    },
  });

  function handleValidSubmit(
    _values: LoginFormValues,
    event?: BaseSyntheticEvent,
  ) {
    const formElement = event?.currentTarget ?? event?.target;

    if (!(formElement instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(formElement);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">登入 BillingVault</CardTitle>
        <CardDescription>
          建議使用一鍵 demo 登入，或輸入測試帳號體驗完整 sandbox 訂閱流程。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          onSubmit={form.handleSubmit(handleValidSubmit)}
        >
          <input
            type="hidden"
            {...form.register("callbackUrl")}
            value={resolvedCallbackUrl}
          />
          <FieldGroup>
            <LoginFormFields control={form.control} state={state} />

            {state.message && (
              <Field data-invalid>
                <FieldError>{state.message}</FieldError>
              </Field>
            )}

            <LoginFormActions pending={pending} demoPending={demoPending} />
          </FieldGroup>
        </form>

        <DemoAccessPanel />

        <form action={demoFormAction} className="mt-4">
          <input
            type="hidden"
            name="callbackUrl"
            value={resolvedDemoCallbackUrl}
          />
          <LoginFormActions
            pending={pending}
            demoPending={demoPending}
            demoFormAction={demoFormAction}
          />
        </form>
        {demoState.message && (
          <Field data-invalid className="mt-3">
            <FieldError>{demoState.message}</FieldError>
          </Field>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3">
        <Button variant="outline" asChild>
          <Link href="/pricing">
            <ShieldCheck data-icon="inline-start" />
            查看方案
          </Link>
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          目前不開放註冊與 OAuth，demo 帳號只連接 sandbox 付款環境。
        </p>
      </CardFooter>
    </Card>
  );
}
