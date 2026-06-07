-- Enable RLS for the public table exposed through Supabase Data API.
ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their order items"
ON "public"."order_items"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."orders"
    WHERE "orders"."id" = "order_items"."order_id"
    AND "orders"."user_id" = (select auth.uid())
  )
);
