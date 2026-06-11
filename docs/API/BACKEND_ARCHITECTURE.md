# Backend Architecture

這份文件說明 SecureCart 的後端結構、Prisma 與 Supabase 在專案中的分工，以及新增資料表時應遵循的流程。

## 技術背景

SecureCart 使用 Next.js 16、React 19、Prisma 7 與 Supabase PostgreSQL。

後端邏輯主要存在於 Next.js 的 server-side 邊界內：

- Server Components
- Server Actions
- Proxy
- Feature Data Access Layer（DAL）
- Prisma Client
- Supabase Auth / PostgreSQL

整體資料流可以理解為：

```txt
Client UI
  -> Server Component / Server Action
  -> Auth DAL
  -> Feature DAL
  -> Prisma Client
  -> Supabase PostgreSQL
```

## 主要目錄

```txt
src/
  app/
    (public)/
    (protected)/

  features/
    account/
    billing/
    checkout/
    payment-methods/
    subscriptions/

  lib/
    auth/
    supabase/
    prisma.ts

  proxy/
    routes.ts
    supabaseProxy.ts

prisma/
  schema.prisma
  models/
    billing.prisma
    checkout.prisma
    payment-methods.prisma
    subscriptions.prisma
  migrations/
```

重要檔案：

- `src/lib/prisma.ts`：建立 server-side Prisma Client。
- `src/lib/supabase/client.ts`：建立 browser Supabase client。
- `src/lib/supabase/server.ts`：建立 server-side Supabase client。
- `src/lib/auth/dal.ts`：server-side auth 驗證與目前使用者讀取。
- `src/proxy.ts`：Next.js Proxy，處理 CSP、受保護路由與 Supabase session refresh。
- `src/proxy/supabaseProxy.ts`：Proxy 中的 Supabase session 判斷與 refresh 邏輯。
- `src/features/*/dal/*`：各功能的資料存取與商業邏輯。
- `prisma/schema.prisma`：Prisma schema 的主檔，保留 generator、datasource 與共用 enum。
- `prisma/models/*.prisma`：依 domain 拆分的 Prisma models。
- `prisma/migrations/*/migration.sql`：實際套用到 Supabase PostgreSQL 的 migration SQL。

## 後端分層

### UI 與 Server 邊界

Client UI 不應直接信任使用者傳來的敏感資料，例如 `userId`、價格、訂單狀態或權限。

需要登入或修改資料的流程應放在 server-side：

1. Server Component 或 Server Action 接收請求。
2. 使用 `verifySession()` 或 `getCurrentUser()` 確認目前使用者。
3. 使用 server-side 信任的 `user.id` 執行商業邏輯。
4. 透過 feature DAL 存取資料庫。

### Auth DAL

Auth 相關邏輯集中在 `src/lib/auth/`。

受保護頁面應使用 `verifySession()`。它會透過 Supabase Auth server 驗證目前 session 是否仍有效，而不是只相信 client state 或 JWT claims。

Proxy 中可以使用 `getClaims()` 做快速判斷與 token refresh，但最終授權仍應在 server-side DAL 或 Server Component 中完成。

### Feature DAL

各功能的資料存取放在 `src/features/*/dal/`。

常見例子：

- `src/features/checkout/dal/*`
- `src/features/billing/dal/*`
- `src/features/payment-methods/dal/*`
- `src/features/subscriptions/dal/*`

Feature DAL 負責：

- 組 Prisma query。
- 套用 domain rule。
- 執行 transaction。
- 將資料轉換成 UI 或 action 需要的 DTO。

DAL 不應把資料庫查詢、UI 呈現、商業規則混在同一個過大的檔案中。若檔案接近或超過 200 行，應依專案規範拆成資料夾結構，例如：

```txt
src/features/subscriptions/dal/listSubscriptionOverview/
  index.ts
  subscriptionQuery.ts
  subscriptionRules.ts
  mappers.ts
  planOptions.ts
  utils.ts
```

`index.ts` 在這裡是主要實作檔，不是單純 re-export 的 barrel file。

## Prisma 的角色

Prisma 在本專案中扮演「資料庫 schema 定義與 server-side 型別安全查詢層」。

Prisma 負責：

- 定義資料表、欄位、enum、relation、index、unique constraint。
- 產生型別安全的 Prisma Client。
- 讓 DAL 使用 `findMany()`、`findFirst()`、`create()`、`update()`、`delete()`、`$transaction()` 等 API 存取資料。
- 協助產生 migration SQL。

Prisma 不是資料庫本身；實際資料儲存在 Supabase PostgreSQL。

### Prisma Client

Prisma Client 由 `prisma/` schema folder 產生，輸出位置是：

```txt
src/generated/prisma
```

server-side 程式統一從 `src/lib/prisma.ts` 使用：

```ts
import { prisma } from "@/lib/prisma";
```

`src/lib/prisma.ts` 會：

- 讀取 `DATABASE_URL`。
- 使用 `@prisma/adapter-pg` 建立 PostgreSQL adapter。
- 建立 Prisma Client。
- 在 development 模式把 client 放到 `globalThis`，避免 hot reload 造成過多連線。

### Prisma Schema

本專案使用 multi-file Prisma schema：

```txt
prisma/
  schema.prisma
  models/
    billing.prisma
    checkout.prisma
    payment-methods.prisma
    subscriptions.prisma
```

`prisma/schema.prisma` 是主檔，只放：

- `generator client`
- `datasource db`
- 共用 enum

實際 model 依 domain 放在 `prisma/models/*.prisma`。

`prisma.config.ts` 需要指向整個 schema folder：

```ts
export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

目前主要 model 包含：

- `PaymentMethod`
- `Order`
- `OrderItem`
- `PaymentRecord`
- `Invoice`
- `Subscription`
- `SubscriptionItem`
- `SubscriptionPlanChange`

Prisma schema 使用 PascalCase model 名稱，並透過 `@@map` / `@map` 對應到 PostgreSQL snake_case table 與 column。

例子：

```prisma
model Order {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  orderNumber String   @unique @map("order_number")

  @@map("orders")
}
```

應用程式中使用 `order.userId`，資料庫中實際欄位是 `orders.user_id`。

## Supabase 的角色

Supabase 在本專案中扮演三個角色：

1. PostgreSQL database
2. Auth / session provider
3. Row Level Security（RLS）與資料安全層

### PostgreSQL Database

Supabase PostgreSQL 是實際資料庫。

Prisma schema 與 migration 最終都會套用到 Supabase PostgreSQL。Prisma Client 的 `DATABASE_URL` 也會連到這個資料庫。

### Auth / Session

本專案使用 Supabase Auth 處理登入、登出、access token、refresh token 與 session。

相關 client：

- `src/lib/supabase/client.ts`：browser client。
- `src/lib/supabase/server.ts`：server client。
- `src/proxy/supabaseProxy.ts`：Proxy 內的 session refresh。

登入成功後，`@supabase/ssr` 會透過 cookie 保存 session。Proxy 會協助刷新快過期的 token。

### RLS / Policy

Supabase 的 `public` schema 可能透過 Data API 暴露，因此公開 schema 內的敏感資料表都應啟用 RLS。

RLS policy 不屬於 Prisma schema 能完整表達的範圍，所以本專案採用：

1. Prisma schema 定義 table、欄位、index、relation。
2. Migration SQL 中手動補上 Supabase RLS policy。

例子：

```sql
ALTER TABLE "public"."subscription_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their subscription items"
ON "public"."subscription_items"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."subscriptions"
    WHERE "subscriptions"."id" = "subscription_items"."subscription_id"
    AND "subscriptions"."user_id" = (select auth.uid())
  )
);
```

Policy 應避免只寫 `TO authenticated` 卻沒有 row ownership 條件。那只代表「已登入」，不代表「只能存取自己的資料」。

## Prisma 與 Supabase 的分工

| 項目                       | Prisma               | Supabase               |
| -------------------------- | -------------------- | ---------------------- |
| 實際資料儲存               | 否                   | 是                     |
| Table schema 定義          | 是                   | 最終承載               |
| Type-safe query            | 是                   | 否                     |
| Migration history          | 是                   | 承載已套用結果         |
| Auth / session             | 否                   | 是                     |
| RLS policy                 | Migration 中手動 SQL | 是                     |
| Data API                   | 否                   | 是                     |
| Server-side business query | 是                   | 透過 PostgreSQL 被查詢 |

簡單說：

- Prisma 管「後端怎麼安全、型別化地查資料」。
- Supabase 管「資料實際存在哪裡、誰登入、資料庫層允許誰看哪些 row」。

## 怎麼開新資料表

新增資料表時，不要只在 Supabase 後台手動開表，也不要只新增 migration 檔案。這個專案以 `prisma/` schema folder 作為主要 schema source，並用 migration 套到 Supabase。

### 1. 修改 Prisma Schema

在對應 domain 的 `prisma/models/*.prisma` 新增 model。

例如：

- 帳務與發票：`prisma/models/billing.prisma`
- checkout / orders：`prisma/models/checkout.prisma`
- 付款方式：`prisma/models/payment-methods.prisma`
- 訂閱：`prisma/models/subscriptions.prisma`

如果是新的 domain，可以在 `prisma/models/` 新增一個清楚命名的 `.prisma` 檔。

例子：新增 coupon table。

```prisma
model Coupon {
  id          String   @id @default(uuid()) @db.Uuid
  code        String   @unique
  discountPct Int      @map("discount_pct")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@index([isActive])
  @@map("coupons")
}
```

命名慣例：

- Prisma model 使用 PascalCase。
- Prisma field 使用 camelCase。
- Database table / column 使用 snake_case。
- 用 `@@map` 對應 table name。
- 用 `@map` 對應 column name。

### 2. 建立 Migration SQL

如果有可用的 local development database 與 shadow database，優先使用：

```bash
pnpm exec prisma migrate dev --name add_coupons --create-only
```

如果因為既有 Supabase RLS 使用 `auth.uid()`，導致 shadow database 缺少 Supabase `auth` schema 而失敗，改用 schema diff 產生 SQL。

專案文件建議流程：

```bash
mkdir -p /private/tmp/secure-cart-prisma-base
git show HEAD:prisma/schema.prisma > /private/tmp/secure-cart-prisma-base/schema.prisma
git show HEAD:prisma/models/billing.prisma > /private/tmp/secure-cart-prisma-base/billing.prisma
git show HEAD:prisma/models/checkout.prisma > /private/tmp/secure-cart-prisma-base/checkout.prisma
git show HEAD:prisma/models/payment-methods.prisma > /private/tmp/secure-cart-prisma-base/payment-methods.prisma
git show HEAD:prisma/models/subscriptions.prisma > /private/tmp/secure-cart-prisma-base/subscriptions.prisma

pnpm exec prisma migrate diff \
  --from-schema /private/tmp/secure-cart-prisma-base \
  --to-schema prisma/ \
  --script > prisma/migrations/<migration-name>/migration.sql
```

Windows 環境可把暫存資料夾改成可寫入的位置，例如 `C:\tmp\secure-cart-prisma-base`。

### 3. 手動補 Supabase RLS Policy

Prisma 產生的 migration 主要處理：

- enum
- table
- column
- index
- unique constraint
- foreign key

Supabase RLS policy 需要手動補在 migration SQL 後段。

如果資料表在 `public` schema，且可能透過 Supabase Data API 暴露，應啟用 RLS：

```sql
ALTER TABLE "public"."coupons" ENABLE ROW LEVEL SECURITY;
```

如果是只允許登入使用者讀取啟用中的 coupon：

```sql
CREATE POLICY "Authenticated users can read active coupons"
ON "public"."coupons"
FOR SELECT
TO authenticated
USING ("is_active" = true);
```

如果資料有 owner，例如 `user_id`，policy 應加入 ownership 條件：

```sql
CREATE POLICY "Users can read their own records"
ON "public"."table_name"
FOR SELECT
TO authenticated
USING ((select auth.uid()) = "user_id");
```

UPDATE policy 通常需要同時寫 `USING` 與 `WITH CHECK`：

```sql
CREATE POLICY "Users can update their own records"
ON "public"."table_name"
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = "user_id")
WITH CHECK ((select auth.uid()) = "user_id");
```

### 4. 驗證 Prisma Schema

```bash
pnpm exec prisma validate
```

### 5. 套用到 Supabase

本專案規則：migration 任務預設是「新增並部署」，除非明確要求只產生檔案。

新增 migration 後應執行：

```bash
npx prisma migrate deploy
```

部署後確認狀態：

```bash
npx prisma migrate status
```

應確認輸出包含：

```txt
Database schema is up to date!
```

### 6. 重新產生 Prisma Client

```bash
pnpm prisma generate
```

或使用 package script：

```bash
pnpm generate
```

如果 Next dev server 正在跑，schema 或 generated client 更新後建議重啟 dev server。

## 新增 DAL 查詢

新增資料表後，應在對應 feature 建立 DAL，而不是讓 UI 直接查資料庫。

範例：

```txt
src/features/coupons/dal/listActiveCoupons.ts
```

```ts
import "server-only";

import { prisma } from "@/lib/prisma";

export async function listActiveCoupons() {
  return prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}
```

如果查詢需要目前使用者，應由 server-side auth 取得 `user.id`，不要信任 client 傳入的 `userId`。

```ts
import "server-only";

import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";

export async function listMyRecords() {
  const { user } = await verifySession();

  return prisma.someModel.findMany({
    where: { userId: user.id },
  });
}
```

## 常見注意事項

### 不要直接用 `prisma migrate dev` 套 Supabase 遠端資料庫

既有 migration 可能包含 Supabase 專屬的 `auth.uid()`。Prisma shadow database 不是 Supabase database，通常沒有 `auth` schema，因此可能出現：

```txt
ERROR: schema "auth" does not exist
```

產生 migration 可以用 `migrate dev --create-only` 或 `migrate diff`，但部署遠端 Supabase 應使用專案規範中的 deploy 流程。

### Prisma schema 與 Supabase DB 必須同步

如果 Prisma Client 已更新，但 Supabase DB 還沒套 migration，可能出現：

```txt
The column table_name.column_name does not exist
```

如果 Supabase DB 已更新，但 Prisma Client 還沒重新產生，可能出現：

```txt
Unknown argument columnName
```

處理方式：

```bash
npx prisma migrate deploy
pnpm prisma generate
```

必要時重啟 Next dev server。

### RLS 不等於 Data API 權限

RLS 控制 row-level access，但不一定代表 table 已經對 `anon` 或 `authenticated` role 開放。

如果未來需要 browser 直接透過 Supabase Data API 查 table，除了 RLS policy，也要確認 Supabase Data API schema / role grant 設定。

### 不要在前端暴露 service role key

前端只能使用 publishable key。`service_role` 或 secret key 只能留在 server-side 安全環境。

任何 `NEXT_PUBLIC_` 環境變數都會被送到 browser，不能放敏感金鑰。

## 開表 Checklist

每次新增或修改資料表時，依序確認：

```txt
1. 修改 prisma/schema.prisma
   或 prisma/models/*.prisma
2. 建立 migration SQL
3. 手動補 Supabase RLS policy
4. pnpm exec prisma validate
5. npx prisma migrate deploy
6. npx prisma migrate status
7. 確認 Database schema is up to date!
8. pnpm prisma generate
9. 必要時重啟 Next dev server
10. 在 feature DAL 新增 server-side 查詢或 mutation
```

如果是修 Supabase Advisor 警告，部署後 Supabase 後台可能需要刷新，或重新執行 Advisor，才會看到最新結果。
