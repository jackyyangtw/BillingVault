# API 架構

本專案的資料存取採用四層分工：

```txt
UI Component
  -> TanStack Query Hook
  -> Server Action
  -> DAL
  -> Database / External Provider
```

這個分層的目的，是讓 React 元件只負責互動與畫面狀態，Server Action 負責安全邊界，DAL 負責資料庫操作。Client Component 不應直接 import DAL，也不應把 `useMutation` 分散在 route component 裡。

## 目錄約定

```txt
src/lib/dals/<domain>/
src/lib/actions/<domain>/
src/lib/queries/<domain>/
```

以付款方式為例：

```txt
src/lib/dals/payment-methods/
  createPaymentMethod.ts
  deletePaymentMethod.ts
  listPaymentMethods.ts
  mapper.ts
  setDefaultPaymentMethod.ts
  types.ts

src/lib/actions/payment-methods/
  createPaymentMethod.ts
  deletePaymentMethod.ts
  listPaymentMethods.ts
  setDefaultPaymentMethod.ts

src/lib/queries/payment-methods/
  keys.ts
  useCreatePaymentMethodMutation.ts
  useDeletePaymentMethodMutation.ts
  usePaymentMethodsListQuery.ts
  useSetDefaultPaymentMethodMutation.ts
```

## DAL

DAL 放在 `src/lib/dals/<domain>/`，只允許 server side 使用。

規範：

- 檔案頂部加入 `import "server-only"`。
- 只處理資料存取、transaction、排序、mapper、domain type。
- 可以 import `prisma`、server-only helper、同 domain 的 mapper/type。
- 不處理 toast、React state、TanStack Query cache invalidation。
- 不直接讀取 client input，input 必須先經過 Server Action 驗證。

範例職責：

```txt
listPaymentMethods(userId)
createPaymentMethod(userId, input)
deletePaymentMethod(userId, id)
setDefaultPaymentMethod(userId, id)
```

Mapper 應留在 DAL domain 內，例如 `mapper.ts` 將 Prisma model 轉成 UI 可使用的 domain type。

## Server Actions

Server Action 放在 `src/lib/actions/<domain>/`。

規範：

- 檔案頂部加入 `"use server"`。
- 每個 action 都必須驗證 authentication / authorization。
- 使用 `verifySession()` 取得目前使用者。
- 對 client 傳入資料使用 Zod 驗證。
- 呼叫 DAL 完成資料操作。
- 回傳簡單、可序列化的資料。

Server Action 是安全邊界。即使 action 只會從 UI 按鈕呼叫，也要假設它可以被直接 POST 呼叫，因此驗證不可省略。

範例：

```ts
"use server";

import { z } from "zod/v4";
import { verifySession } from "@/lib/auth/dal";
import { deletePaymentMethod } from "@/lib/dals/payment-methods/deletePaymentMethod";

const deletePaymentMethodSchema = z.object({
  id: z.string().uuid(),
});

export async function deletePaymentMethodAction(input: { id: string }) {
  const parsed = deletePaymentMethodSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("付款方式資料無效。");
  }

  const { userId } = await verifySession();
  await deletePaymentMethod(userId, parsed.data.id);

  return { message: "Payment method has been deleted." };
}
```

## TanStack Query

TanStack Query hooks 放在 `src/lib/queries/<domain>/`。

規範：

- Hook 名稱使用 `useXXXQuery` 或 `useXXXMutation`。
- Query key 集中在同 domain 的 `keys.ts`。
- `useQuery` / `useMutation` / `useQueryClient` 只放在 query hook 裡。
- Mutation 成功後，由 query hook 統一 invalidate 相關 query。
- UI 元件可在 `mutate` options 裡處理 toast、dialog close、form reset 等畫面互動。

範例：

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentMethodAction } from "@/lib/actions/payment-methods/deletePaymentMethod";
import { paymentMethodsQueryKey } from "./keys";

export function useDeletePaymentMethodMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["payment-methods", "delete", id],
    mutationFn: deletePaymentMethodAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: paymentMethodsQueryKey,
      });
    },
  });
}
```

## UI Components

UI 元件只負責畫面與互動。

可以做：

- 呼叫 `useXXXQuery()` 取得資料。
- 呼叫 `useXXXMutation()` 執行 mutation。
- 控制 dialog open state、form state、loading state。
- 在 mutation callback 裡處理 toast、reset form、關閉 dialog。

不應做：

- 直接 import DAL。
- 直接 import Server Action。
- 在 route component 裡直接寫 `useMutation`。
- 為了同步 props/state 而在 `useEffect` 裡 `setState`。

範例：

```ts
const deleteMutation = useDeletePaymentMethodMutation(method.id);

function handleDelete() {
  deleteMutation.mutate(
    { id: method.id },
    {
      onSuccess: () => {
        setIsConfirmOpen(false);
        toast.success("卡片已刪除");
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "卡片刪除失敗。");
      },
    },
  );
}
```

## 新增功能流程

新增一個 domain API 時，依照以下順序：

1. 建立 DAL：`src/lib/dals/<domain>/<operation>.ts`
2. 建立 domain type / mapper：必要時放在同 domain 目錄
3. 建立 Server Action：`src/lib/actions/<domain>/<operation>.ts`
4. 建立 query key：`src/lib/queries/<domain>/keys.ts`
5. 建立 query hook：`useXXXQuery.ts` 或 `useXXXMutation.ts`
6. UI component 只 import query hook

## Import 規則

- 深層路徑超過 `../../` 時使用 `@/` alias。
- 不新增只做 re-export 的 barrel 檔。
- Import 指向實際功能檔案，例如：

```ts
import { listPaymentMethods } from "@/lib/dals/payment-methods/listPaymentMethods";
import { usePaymentMethodsListQuery } from "@/lib/queries/payment-methods/usePaymentMethodsListQuery";
```

## React Compiler 注意事項

因為專案啟用了 React Compiler，新增 query hook 或 UI 元件時要注意：

- Hook 只能在最頂層呼叫。
- Render 期間不能有 side effects。
- 不要在 render 期間讀寫 `ref.current`。
- 不要直接 mutation props/state。
- 傳給子元件的物件與函式，盡量保持穩定；必要時將邏輯移出元件或使用既有 hook 封裝。

資料同步優先交給 TanStack Query cache invalidation，不要為了同步 server data 和 local state 寫 `useEffect + setState`。
