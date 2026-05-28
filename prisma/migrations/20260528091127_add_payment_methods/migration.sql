-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('tappay');

-- CreateEnum
CREATE TYPE "TapPayPrimeState" AS ENUM ('ready', 'requires_refresh', 'unavailable');

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'tappay',
    "provider_payment_method_id" TEXT,
    "card_identifier" TEXT,
    "brand" TEXT NOT NULL,
    "last4" VARCHAR(4) NOT NULL,
    "holder" TEXT NOT NULL,
    "billing_email" TEXT NOT NULL,
    "exp_month" INTEGER,
    "exp_year" INTEGER,
    "tappay_prime_state" "TapPayPrimeState" NOT NULL DEFAULT 'ready',
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_methods_user_id_created_at_idx" ON "payment_methods"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "payment_methods_user_id_is_default_idx" ON "payment_methods"("user_id", "is_default");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_one_default_per_user_idx"
ON "payment_methods"("user_id")
WHERE "is_default" = true;

-- EnableRLS
ALTER TABLE "payment_methods" ENABLE ROW LEVEL SECURITY;

-- CreatePolicy
CREATE POLICY "Users can read their payment methods"
ON "payment_methods"
FOR SELECT
TO authenticated
USING ((select auth.uid()) = "user_id");

-- CreatePolicy
CREATE POLICY "Users can insert their payment methods"
ON "payment_methods"
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = "user_id");

-- CreatePolicy
CREATE POLICY "Users can update their payment methods"
ON "payment_methods"
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = "user_id")
WITH CHECK ((select auth.uid()) = "user_id");

-- CreatePolicy
CREATE POLICY "Users can delete their payment methods"
ON "payment_methods"
FOR DELETE
TO authenticated
USING ((select auth.uid()) = "user_id");
