"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createCoupleSpace, joinCoupleByInviteCode } from "@/lib/services/couples";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [inviteCode, setInviteCode] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Not signed in.");
      const couple = await createCoupleSpace(supabase, data.user.id);
      setCreatedCode(couple.invite_code);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await joinCoupleByInviteCode(supabase, inviteCode.trim());
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <GlassCard className="w-full max-w-md text-center">
        {mode === "choose" && (
          <>
            <h1 className="font-display text-3xl mb-2">Let's set up your space</h1>
            <p className="text-ink-soft text-sm mb-8">Create a new one, or join your partner's.</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setMode("create")}>Create a New Space</Button>
              <Button variant="outline" onClick={() => setMode("join")}>
                Join with Invite Code
              </Button>
            </div>
          </>
        )}

        {mode === "create" && !createdCode && (
          <>
            <h2 className="font-display text-2xl mb-2">Create Your Space</h2>
            <p className="text-ink-soft text-sm mb-8">
              We'll generate a private invite code to share with your partner.
            </p>
            <Button onClick={handleCreate} disabled={loading} className="w-full">
              {loading ? "Creating…" : "Create Space"}
            </Button>
          </>
        )}

        {createdCode && (
          <>
            <h2 className="font-display text-2xl mb-2">Your space is ready 🎉</h2>
            <p className="text-ink-soft text-sm mb-4">Share this code with your partner:</p>
            <div className="rounded-xl bg-paper border border-magenta/40 py-4 mb-6">
              <span className="font-display text-2xl brand-text tracking-widest">{createdCode}</span>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </>
        )}

        {mode === "join" && (
          <form onSubmit={handleJoin}>
            <h2 className="font-display text-2xl mb-2">Join Your Partner's Space</h2>
            <p className="text-ink-soft text-sm mb-6">Enter the invite code they shared with you.</p>
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="JOIN-AB92X"
              required
              className="w-full text-center tracking-widest rounded-xl bg-paper border border-hairline px-4 py-3 mb-4 outline-none focus:border-magenta"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Joining…" : "Join Space"}
            </Button>
          </form>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </GlassCard>
    </main>
  );
}
