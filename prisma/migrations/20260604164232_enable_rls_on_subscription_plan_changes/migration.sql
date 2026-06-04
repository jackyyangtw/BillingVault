-- Enable RLS for the public table exposed through Supabase Data API.
ALTER TABLE "public"."subscription_plan_changes" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their subscription plan changes"
ON "public"."subscription_plan_changes"
FOR SELECT
TO authenticated
USING ((select auth.uid()) = "user_id");
