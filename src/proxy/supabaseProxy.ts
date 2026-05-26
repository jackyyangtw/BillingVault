import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";
import { createNextResponse } from "./response";

type SupabaseProxySessionResult = {
  response: NextResponse;
  isAuthenticated: boolean;
};

export async function resolveSupabaseProxySession({
  request,
  response,
  requestHeaders,
  contentSecurityPolicy,
}: {
  request: NextRequest;
  response: NextResponse;
  requestHeaders: Headers;
  contentSecurityPolicy: string;
}): Promise<SupabaseProxySessionResult> {
  const supabaseEnv = getSupabaseEnv();

  if (!supabaseEnv) {
    return { response, isAuthenticated: false };
  }

  let nextResponse = response;
  const supabase = createServerClient(
    supabaseEnv.url,
    supabaseEnv.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          nextResponse = createNextResponse(
            requestHeaders,
            contentSecurityPolicy,
          );

          cookiesToSet.forEach(({ name, value, options }) => {
            nextResponse.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) => {
            nextResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();

  return {
    response: nextResponse,
    isAuthenticated: Boolean(data?.claims?.sub),
  };
}
