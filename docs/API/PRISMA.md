# Prisma 與 Supabase Schema 更新流程

本專案使用 Prisma 7、Next.js 16、Supabase PostgreSQL。修改
`prisma/schema.prisma` 後，請照以下流程處理，避免 Prisma Client、Next dev
server、真實資料庫 schema 不同步。

## 重要原則

- 不要直接用 `prisma migrate dev` 套 Supabase 遠端資料庫。
- 既有 migration 使用 Supabase RLS policy，例如 `auth.uid()`。
- Prisma `migrate dev` 會建立 shadow database 並重播所有 migration；shadow
  database 是普通 PostgreSQL，沒有 Supabase 的 `auth` schema，因此會出現：

```text
ERROR: schema "auth" does not exist
```

## Migration 產生原則

Prisma schema 能描述 table、enum、index、foreign key 等結構；Supabase RLS
policy 例如 `auth.uid()` 不屬於 Prisma schema 能完整表達的範圍。

因此 migration 應拆成兩段：

1. **Prisma-generated schema migration**：由 Prisma CLI 產生或 diff 產生。
2. **Supabase RLS policies**：人工補上並 review。

不要憑空手寫整份 schema migration。人工 SQL 只應用在 Prisma 無法表達的
Supabase policy、extension、特殊 function 或資料修補。

## 修改 Prisma Schema 後要做什麼

1. 修改 `prisma/schema.prisma`。

2. 建立對應 migration SQL。

如果有可用的本地 development database 與 shadow database，優先使用：

```bash
pnpm exec prisma migrate dev --name <migration-name> --create-only
```

如果目前不能使用 `migrate dev`，例如 Supabase RLS `auth.uid()` 會讓 shadow
database 重播既有 migration 失敗，則使用 schema diff 產 SQL：

```bash
git show HEAD:prisma/schema.prisma > /private/tmp/secure-cart-base-schema.prisma

pnpm exec prisma migrate diff \
  --from-schema /private/tmp/secure-cart-base-schema.prisma \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/<migration-name>/migration.sql
```

產完後再手動補上 Prisma 無法產生的 Supabase RLS policy 區塊。

範例：

```sql
ALTER TABLE "payment_methods"
ADD COLUMN "bin_code" VARCHAR(6);
```

3. 驗證 Prisma schema。

```bash
pnpm exec prisma validate
```

4. 將 SQL 套到目前 Supabase 資料庫。

Prisma 7 的 `db execute` 會從 `prisma.config.ts` 讀取 datasource，不支援
`--schema`。

```bash
pnpm prisma db execute --file prisma/migrations/<migration-name>/migration.sql
```

5. 如果這個 migration 是用 `db execute` 手動套用，而不是 Prisma migrate 套用，標記為已套用。

```bash
pnpm prisma migrate resolve --applied <migration-name>
```

6. 重新產生 Prisma Client。

```bash
pnpm prisma generate
```

7. 重啟 Next dev server。

Prisma runtime schema 會被 dev server process cache。只 hot reload 不一定會載入新的 generated client。

```bash
pnpm dev
```

## 套用前先確認欄位是否已存在

如果不確定 SQL 是否已經套過，先查欄位，避免重複 `ADD COLUMN`：

```bash
pnpm prisma db execute --stdin
```

貼上：

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'payment_methods'
  AND column_name = 'bin_code';
```

有回傳 `bin_code` 就代表欄位已存在。

## 常見錯誤

### `Unknown argument binCode`

代表正在跑的 app server 或 Prisma Client 還是舊的，不認得新欄位。

處理：

```bash
pnpm prisma generate
```

然後重啟 dev server。

### `The column payment_methods.bin_code does not exist`

代表 Prisma Client 已更新，但真實 Supabase DB 還沒套欄位。

處理：

```bash
pnpm prisma db execute --file prisma/migrations/<migration-name>/migration.sql
pnpm prisma generate
```

然後重啟 dev server。

### `schema "auth" does not exist`

通常是執行 `pnpm prisma migrate dev` 時發生。原因是 Prisma shadow database
不是 Supabase database，沒有 `auth.uid()` 所需的 `auth` schema。

處理：

- 停止使用 `migrate dev` 套這個 Supabase schema。
- 改用 `pnpm prisma db execute --file ...` 套 SQL。
- 套完後使用 `pnpm prisma migrate resolve --applied <migration-name>` 標記。

## 快速 Checklist

每次改 `prisma/schema.prisma` 後：

```bash
pnpm exec prisma validate
pnpm prisma db execute --file prisma/migrations/<migration-name>/migration.sql
pnpm prisma migrate resolve --applied <migration-name>
pnpm prisma generate
pnpm dev
```

如果 dev server 正在跑，先停掉再重新啟動。
