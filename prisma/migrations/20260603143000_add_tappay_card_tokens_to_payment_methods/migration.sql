ALTER TABLE "payment_methods"
ADD COLUMN "provider_card_key" VARCHAR(64),
ADD COLUMN "provider_card_token" VARCHAR(67);
