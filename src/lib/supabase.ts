import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build-time prerendering, env vars may not be available.
    // Return a client with placeholder values — it won't be used at build time
    // since client components only run their effects in the browser.
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder"
    );
  }

  return createBrowserClient(url, key);
}
