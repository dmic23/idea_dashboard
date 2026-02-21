"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-4xl text-black mb-8 tracking-tight">
          Idea Generator
        </h1>

        {sent ? (
          <p className="text-graphite">
            Check your email for a magic link to sign in.
          </p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-4 border border-mist rounded-precision bg-ivory text-black placeholder:text-stone focus:outline-none focus:border-indigo transition-colors"
            />
            {error && (
              <p className="text-status-red text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-indigo text-white font-sans font-medium text-[15px] rounded-precision hover:bg-indigo-deep transition-colors"
            >
              Send magic link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
