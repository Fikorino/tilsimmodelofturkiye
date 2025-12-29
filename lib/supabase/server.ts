import { cookies } from "next/headers";
import { createServerComponentClient, createServerActionClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export function createSupabaseServerComponentClient() {
  return createServerComponentClient({ cookies });
}

export function createSupabaseServerActionClient() {
  return createServerActionClient({ cookies });
}

export function createSupabaseRouteHandlerClient() {
  return createRouteHandlerClient({ cookies });
}
