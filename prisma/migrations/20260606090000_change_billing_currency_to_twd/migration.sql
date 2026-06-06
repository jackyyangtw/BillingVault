ALTER TABLE "orders"
  ALTER COLUMN "currency" SET DEFAULT 'twd';

ALTER TABLE "payment_records"
  ALTER COLUMN "currency" SET DEFAULT 'twd';

ALTER TABLE "invoices"
  ALTER COLUMN "currency" SET DEFAULT 'twd';

UPDATE "orders"
SET "currency" = 'twd'
WHERE "currency" IN ('USD', 'TWD');

UPDATE "payment_records"
SET "currency" = 'twd'
WHERE "currency" IN ('USD', 'TWD');

UPDATE "invoices"
SET "currency" = 'twd'
WHERE "currency" IN ('USD', 'TWD');
