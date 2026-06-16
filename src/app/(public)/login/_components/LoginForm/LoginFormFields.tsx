"use client";

import { Controller, type Control } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { LoginFormState, LoginFormValues } from "../../schema";

type LoginFormFieldsProps = {
  control: Control<LoginFormValues>;
  state: LoginFormState;
};

export default function LoginFormFields({
  control,
  state,
}: LoginFormFieldsProps) {
  return (
    <>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => {
          const serverErrors = state.errors?.email;
          const invalid = fieldState.invalid || Boolean(serverErrors?.length);

          return (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                placeholder="demo@example.com"
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
        control={control}
        render={({ field, fieldState }) => {
          const serverErrors = state.errors?.password;
          const invalid = fieldState.invalid || Boolean(serverErrors?.length);

          return (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor={field.name}>密碼</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="current-password"
                placeholder="輸入測試密碼"
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
    </>
  );
}
