import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build-time prerendering, NEXT_PUBLIC_ vars are inlined as undefined.
  // Return a minimal client that won't crash — effects only run in the browser.
  _client = createSupabaseClient(
    url || "https://placeholder.supabase.co",
    key || "placeholder"
  );

  return _client;
}
