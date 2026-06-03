CREATE TYPE "SubscriptionPlanChangeStatus" AS ENUM ('pending', 'applied', 'canceled');

CREATE TABLE "subscription_plan_changes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "from_plan_id" TEXT NOT NULL,
    "to_plan_id" TEXT NOT NULL,
    "effective_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "SubscriptionPlanChangeStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscription_plan_changes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "subscription_plan_changes_one_pending_per_subscription_idx" ON "subscription_plan_changes"("subscription_id", "status") WHERE (status = 'pending');
CREATE INDEX "subscription_plan_changes_user_id_status_idx" ON "subscription_plan_changes"("user_id", "status");
CREATE INDEX "subscription_plan_changes_subscription_id_status_idx" ON "subscription_plan_changes"("subscription_id", "status");
CREATE INDEX "subscription_plan_changes_effective_at_status_idx" ON "subscription_plan_changes"("effective_at", "status");

ALTER TABLE "subscription_plan_changes" ADD CONSTRAINT "subscription_plan_changes_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
