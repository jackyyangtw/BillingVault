-- Enable RLS for the public table exposed through Supabase Data API.
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
