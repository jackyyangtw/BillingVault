ALTER TABLE "subscription_plan_changes"
ADD COLUMN "from_cycle" VARCHAR(16),
ADD COLUMN "to_cycle" VARCHAR(16);

UPDATE "subscription_plan_changes" AS "change"
SET
  "from_cycle" = "subscription"."cycle",
  "to_cycle" = "subscription"."cycle"
FROM "subscriptions" AS "subscription"
WHERE "change"."subscription_id" = "subscription"."id";

UPDATE "subscription_plan_changes"
SET
  "from_cycle" = COALESCE("from_cycle", 'monthly'),
  "to_cycle" = COALESCE("to_cycle", 'monthly');

ALTER TABLE "subscription_plan_changes"
ALTER COLUMN "from_cycle" SET NOT NULL,
ALTER COLUMN "to_cycle" SET NOT NULL;
