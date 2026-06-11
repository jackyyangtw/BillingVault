# 表單開發指南 — React Hook Form + shadcn/ui Field

本專案所有表單統一採用 **React Hook Form `<Controller />`** 搭配 **shadcn/ui `<Field />`** 元件的整合模式。

---

## 為什麼統一使用 Controller？

### 1. 與 shadcn/ui Field 系統的官方推薦整合

shadcn/ui 的 `<Field />` 元件設計為搭配 `<Controller />` 使用，官方文件明確指出：

> Uses React Hook Form's `useForm` hook for form state management.
> `<Controller />` component for controlled inputs.
> `<Field />` components for building accessible forms.

統一使用 Controller 能確保與 shadcn/ui 的設計理念一致。

### 2. `fieldState` 提供即時的欄位驗證狀態

Controller 的 render prop 直接提供 `fieldState`，包含 `invalid`、`error` 等屬性，可以在**同一個作用域**內同時處理欄位綁定與錯誤顯示：

```tsx
<Controller
  name="password"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>密碼</FieldLabel>
      <Input
        {...field}
        id={field.name}
        type="password"
        autoComplete="current-password"
        aria-invalid={fieldState.invalid}
        required
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

相較之下，`register()` 需要額外從 `formState.errors` 取得錯誤，欄位名稱散落在多處：

```tsx
// register 寫法 — 欄位名稱需重複出現
<Field data-invalid={!!errors.email}>
  <Input {...register("email")} aria-invalid={!!errors.email} />
  {errors.email && <FieldError errors={[errors.email]} />}
</Field>
```

### 3. 所有元件類型通用

專案中使用的 shadcn/ui 元件並非都支援 `register()`：

| 元件類型   | 範例                                         | 支援 `register()`？        |
| ---------- | -------------------------------------------- | -------------------------- |
| 原生 input | `<Input />`, `<Input type="password" />`     | ✅                         |
| Radix 元件 | `<RadioGroup />`, `<Select />`, `<Switch />` | ❌（使用 `onValueChange`） |
| 需要值轉換 | 統一編號 `replace(/\D/g, "")`                | ❌（需攔截 `onChange`）    |

統一使用 Controller，不需要判斷「這個元件該用 `register` 還是 `Controller`」，**一種寫法適用所有情境**。

### 4. 程式碼模式一致，降低維護成本

團隊成員只需學習一種表單欄位的寫法模式，降低認知負擔：

- 新成員加入時能快速理解慣例
- Code Review 時有統一的標準可依循
- 不會出現同一個表單混用兩種風格的情況

---

## 標準表單結構

### 基本模板

```tsx
"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// 1️⃣ 定義 Zod Schema
const formSchema = z.object({
  email: z.string().trim().email("請輸入有效的 Email"),
  password: z.string().min(1, "請輸入密碼"),
});

type FormValues = z.infer<typeof formSchema>;

// 2️⃣ 建立元件
export default function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  // 3️⃣ 使用 Controller + Field 建構表單
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>密碼</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={!form.formState.isValid}>
        送出
      </Button>
    </form>
  );
}
```

### 跨元件共享表單（FormProvider + useFormContext）

當表單拆分為多個子元件時，使用 `FormProvider` 提供 context：

```tsx
// 父元件
import { FormProvider, useForm } from "react-hook-form";

export default function CheckoutPage() {
  const form = useForm<CheckoutFormValues>({ ... });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CustomerInfoSection />
        <InvoiceSection />
      </form>
    </FormProvider>
  );
}
```

```tsx
// 子元件
import { Controller, useFormContext } from "react-hook-form";

export default function CustomerInfoSection() {
  const { control } = useFormContext<CheckoutFormValues>();

  return (
    <Controller
      name="companyName"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>公司或團隊名稱</FieldLabel>
          <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
```

---

## Controller vs register — 何時例外？

本專案**不建議使用 `register()`**，但了解差異有助於技術決策：

|          | `Controller`                       | `register()`                 |
| -------- | ---------------------------------- | ---------------------------- |
| 綁定方式 | `value` / `onChange`（controlled） | `ref`（uncontrolled）        |
| 適用元件 | **所有元件**                       | 僅支援 `ref` 轉發的原生元件  |
| 驗證狀態 | `fieldState` 直接提供              | 需從 `formState.errors` 取得 |
| 效能     | 每次 onChange 觸發 render（隔離）  | 不觸發 re-render             |
| 值轉換   | 可在 `onChange` 攔截轉換           | 需額外處理                   |

> **效能差異在一般表單（< 50 欄位）中可忽略不計。** Controller 的 re-render 僅限於該 render prop 內部，不會擴散到整個表單。

---

## 常用元件搭配範例

### Input（密碼輸入）

```tsx
<Controller
  name="password"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>密碼</FieldLabel>
      <Input
        {...field}
        id={field.name}
        type="password"
        autoComplete="current-password"
        aria-invalid={fieldState.invalid}
        required
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Select（下拉選單）

```tsx
<Controller
  name="cycle"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="cycle">付款週期</FieldLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger
          id="cycle"
          className="w-full"
          aria-invalid={fieldState.invalid}
        >
          <SelectValue placeholder="選擇週期" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="monthly">月繳</SelectItem>
            <SelectItem value="yearly">年繳</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### RadioGroup（單選）

```tsx
<Controller
  name="paymentMethod"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>付款方式</FieldLabel>
      <RadioGroup value={field.value} onValueChange={field.onChange}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="saved" id="payment-method-saved" />
          <Label htmlFor="payment-method-saved">使用已儲存卡片</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="new" id="payment-method-new" />
          <Label htmlFor="payment-method-new">新增付款卡片</Label>
        </div>
      </RadioGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### 帶有值轉換的 Input

```tsx
<Controller
  name="taxId"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>統一編號</FieldLabel>
      <Input
        {...field}
        id={field.name}
        maxLength={8}
        inputMode="numeric"
        onChange={(event) =>
          field.onChange(event.target.value.replace(/\D/g, ""))
        }
        aria-invalid={fieldState.invalid}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Checklist

撰寫表單時請確認以下事項：

- [ ] 使用 Zod 定義 schema，型別由 `z.infer` 推導
- [ ] `useForm` 設定 `standardSchemaResolver` 與 `mode: "onTouched"`
- [ ] 所有欄位使用 `<Controller />` 包裝
- [ ] `<Field>` 設定 `data-invalid={fieldState.invalid}`
- [ ] 輸入元件設定 `aria-invalid={fieldState.invalid}`
- [ ] 驗證錯誤透過 `<FieldError errors={[fieldState.error]} />` 顯示
- [ ] 每個欄位都有 `id` 和對應的 `<FieldLabel htmlFor="...">`
- [ ] 需要瀏覽器自動填入的欄位設定正確 `type` 與 `autoComplete`
