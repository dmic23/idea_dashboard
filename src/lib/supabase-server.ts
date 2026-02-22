import { createClient } from "@supabase/supabase-js";

export async function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // During build-time prerendering, env vars may not be available.
    // Return a client with placeholder values — queries will fail gracefully
    // and pages will render with empty data, then populate at runtime.
    return createClient("https://placeholder.supabase.co", "placeholder");
  }

  return createClient(url, key);
}
