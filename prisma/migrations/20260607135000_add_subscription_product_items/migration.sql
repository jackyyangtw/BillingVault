CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'twd',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subscription_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscription_id" UUID NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_items_pkey" PRIMARY KEY ("id")
);

INSERT INTO "order_items" ("order_id", "product_id", "amount_cents", "currency", "created_at", "updated_at")
SELECT
    "id",
    "product_id",
    CASE
        WHEN "cycle" = 'yearly' THEN
            CASE "product_id"
                WHEN 'codeguard' THEN 570000
                WHEN 'deploywatch' THEN 450000
                WHEN 'errorpulse' THEN 870000
                WHEN 'metricflow' THEN 1170000
                WHEN 'teamvault' THEN 1470000
                WHEN 'alertgrid' THEN 750000
                ELSE 0
            END
        ELSE
            CASE "product_id"
                WHEN 'codeguard' THEN 57000
                WHEN 'deploywatch' THEN 45000
                WHEN 'errorpulse' THEN 87000
                WHEN 'metricflow' THEN 117000
                WHEN 'teamvault' THEN 147000
                WHEN 'alertgrid' THEN 75000
                ELSE 0
            END
    END,
    "currency",
    "created_at",
    "updated_at"
FROM "orders";

INSERT INTO "subscription_items" ("subscription_id", "product_id", "created_at", "updated_at")
SELECT "id", "product_id", "created_at", "updated_at"
FROM "subscriptions";

CREATE UNIQUE INDEX "order_items_order_id_product_id_key" ON "order_items"("order_id", "product_id");
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

CREATE UNIQUE INDEX "subscription_items_subscription_id_product_id_key" ON "subscription_items"("subscription_id", "product_id");
CREATE INDEX "subscription_items_subscription_id_idx" ON "subscription_items"("subscription_id");

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscription_items" ADD CONSTRAINT "subscription_items_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
