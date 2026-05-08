"use client";

import Link from "next/link";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LoaderCircle, LogIn, ShieldCheck } from "lucide-react";
import { startTransition, useActionState } from "react";
import type { BaseSyntheticEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "../actions";
import {
  initialLoginFormState,
  loginFormSchema,
  type LoginFormValues,
} from "../schema";

type LoginFormProps = {
  callbackUrl: string;
};

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialLoginFormState,
  );
  const resolvedCallbackUrl = state.fields.callbackUrl || callbackUrl;

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
        <CardTitle className="text-2xl">登入 SecureCart</CardTitle>
        <CardDescription>
          使用測試帳號登入，繼續完成安全結帳流程。
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
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => {
                const serverErrors = state.errors?.email;
                const invalid =
                  fieldState.invalid || Boolean(serverErrors?.length);

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="demo@securecart.dev"
                      aria-invalid={invalid}
                      required
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      serverErrors?.length && (
                        <FieldError>{serverErrors.join(" ")}</FieldError>
                      )
                    )}
                  </Field>
                );
              }}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => {
                const serverErrors = state.errors?.password;
                const invalid =
                  fieldState.invalid || Boolean(serverErrors?.length);

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>密碼</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      autoComplete="current-password"
                      placeholder="secure-demo-2026"
                      aria-invalid={invalid}
                      required
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      serverErrors?.length && (
                        <FieldError>{serverErrors.join(" ")}</FieldError>
                      )
                    )}
                  </Field>
                );
              }}
            />

            {state.message && (
              <Field data-invalid>
                <FieldError>{state.message}</FieldError>
              </Field>
            )}

            <Button type="submit" size="lg" disabled={pending}>
              {pending ? (
                <LoaderCircle
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : (
                <LogIn data-icon="inline-start" />
              )}
              登入
            </Button>

            <FieldSeparator>測試帳號</FieldSeparator>

            <Field>
              <FieldDescription className="text-center">
                demo@securecart.dev / secure-demo-2026
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3">
        <Button variant="outline" asChild>
          <Link href="/pricing">
            <ShieldCheck data-icon="inline-start" />
            查看方案
          </Link>
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          還沒有帳號？目前可先使用 mock 帳號體驗完整流程。
        </p>
      </CardFooter>
    </Card>
  );
}
