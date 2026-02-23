import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // @supabase/ssr reads env vars internally and throws during build-time
  // prerendering when NEXT_PUBLIC_ vars aren't available. Fall back to
  // @supabase/supabase-js which accepts positional args without env checks.
  if (!url || !key) {
    return createSupabaseClient("https://placeholder.supabase.co", "placeholder");
  }

  return createBrowserClient(url, key);
}
