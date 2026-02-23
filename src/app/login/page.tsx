"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  function getSupabase() {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await getSupabase().auth.signInWithOtp({
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm motion-preset-fade motion-duration-300">
        <CardHeader className="text-center pb-2">
          <h1 className="font-mono text-2xl font-bold text-emerald-500 tracking-tight">
            Idea Generator
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in to your dashboard
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-zinc-300 text-sm text-center py-4">
              Check your email for a magic link to sign in.
            </p>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              {error && (
                <p className="text-status-red text-sm">{error}</p>
              )}
              <Button type="submit" className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400">
                Send magic link
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
