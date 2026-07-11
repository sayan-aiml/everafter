"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"magic-link" | "password">("magic-link");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/callback` },
    });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/callback` },
    });
    setLoading(false);
    setStatus(error ? error.message : "Check your inbox for a magic link.");
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    // Attempt sign-in first; if the user doesn't exist, sign them up.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/callback` },
      });
      setStatus(signUpError ? signUpError.message : "Account created — check your inbox to confirm.");
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <GlassCard className="w-full max-w-md">
        <h1 className="font-display text-3xl text-center mb-1">Welcome to EverAfter</h1>
        <p className="text-center text-ink-soft text-sm mb-8">A space just for the two of you.</p>

        <Button variant="outline" className="w-full mb-6" onClick={handleGoogle}>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-lavender-soft/20" />
          <span className="text-xs text-ink-soft">or</span>
          <div className="h-px flex-1 bg-lavender-soft/20" />
        </div>

        <div className="flex gap-2 mb-4 text-xs">
          <button
            className={`px-3 py-1 rounded-full ${mode === "magic-link" ? "bg-lavender-soft/20 text-ink" : "text-ink-soft"}`}
            onClick={() => setMode("magic-link")}
            type="button"
          >
            Magic Link
          </button>
          <button
            className={`px-3 py-1 rounded-full ${mode === "password" ? "bg-lavender-soft/20 text-ink" : "text-ink-soft"}`}
            onClick={() => setMode("password")}
            type="button"
          >
            Email + Password
          </button>
        </div>

        <form onSubmit={mode === "magic-link" ? handleMagicLink : handlePassword} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-paper border border-hairline px-4 py-3 outline-none focus:border-magenta"
          />
          {mode === "password" && (
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-paper border border-hairline px-4 py-3 outline-none focus:border-magenta"
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : mode === "magic-link" ? "Send Magic Link" : "Continue"}
          </Button>
        </form>

        {status && <p className="mt-4 text-center text-sm text-lavender-deep">{status}</p>}
      </GlassCard>
    </main>
  );
}
