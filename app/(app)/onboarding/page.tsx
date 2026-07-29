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
  const [copied, setCopied] = useState(false);
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
      setError(e.message || "Failed to create couple space.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await joinCoupleByInviteCode(supabase, inviteCode.trim().toUpperCase());
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "Invalid or expired invite code.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12 bg-paper overflow-hidden text-ink">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-gradient-soft rounded-full blur-3xl opacity-50 animate-pulse-glow" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="text-center shadow-floating">
          {mode === "choose" && (
            <div className="animate-fade-up">
              <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-md">
                ✨
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Welcome to EverAfter</h1>
              <p className="text-ink-soft text-sm mb-8 leading-relaxed">
                Let's set up your private couple space. You can create a new space or enter an invite code.
              </p>

              <div className="flex flex-col gap-3">
                <Button size="lg" onClick={() => setMode("create")} className="w-full">
                  Create a New Couple Space ✨
                </Button>
                <Button variant="outline" size="lg" onClick={() => setMode("join")} className="w-full">
                  Join Partner with Invite Code 🔑
                </Button>
              </div>
            </div>
          )}

          {mode === "create" && !createdCode && (
            <div className="animate-fade-up">
              <button
                onClick={() => setMode("choose")}
                className="text-xs text-ink-soft hover:text-magenta mb-4 inline-flex items-center gap-1 font-medium"
              >
                ← Back to choices
              </button>
              <h2 className="font-display text-3xl font-bold mb-2">Create Your Space</h2>
              <p className="text-ink-soft text-sm mb-8 leading-relaxed">
                We'll generate a secret 1-click invite code for you to share with your partner.
              </p>
              <Button size="lg" onClick={handleCreate} loading={loading} className="w-full">
                Generate Private Space
              </Button>
            </div>
          )}

          {createdCode && (
            <div className="animate-fade-up">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="font-display text-3xl font-bold mb-2">Your space is live!</h2>
              <p className="text-ink-soft text-sm mb-6">
                Share this unique invite code with your partner to link your space:
              </p>

              <div className="rounded-2xl bg-paper border-2 border-magenta/40 p-5 mb-6 shadow-sm">
                <p className="eyebrow mb-1">Your Couple Invite Code</p>
                <span className="font-display text-3xl brand-text tracking-widest font-bold select-all">
                  {createdCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-3 block w-full text-xs font-semibold text-magenta hover:text-magenta-deep transition-colors"
                >
                  {copied ? "✓ Copied to clipboard!" : "📋 Copy invite code"}
                </button>
              </div>

              <Button size="lg" onClick={() => router.push("/dashboard")} className="w-full">
                Enter Your Space Dashboard →
              </Button>
            </div>
          )}

          {mode === "join" && (
            <form onSubmit={handleJoin} className="animate-fade-up">
              <button
                type="button"
                onClick={() => setMode("choose")}
                className="text-xs text-ink-soft hover:text-magenta mb-4 inline-flex items-center gap-1 font-medium"
              >
                ← Back to choices
              </button>
              <h2 className="font-display text-3xl font-bold mb-2">Join Your Partner</h2>
              <p className="text-ink-soft text-sm mb-6">
                Enter the invite code shared by your partner (e.g., JOIN-AB92X):
              </p>
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="JOIN-AB92X"
                required
                className="w-full text-center tracking-widest font-mono uppercase rounded-xl bg-paper border border-hairline px-4 py-3.5 text-lg font-bold mb-5 outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/20"
              />
              <Button type="submit" size="lg" loading={loading} className="w-full">
                Join Partner Space
              </Button>
            </form>
          )}

          {error && (
            <div className="mt-5 p-3 rounded-xl bg-rose-blush border border-rose-soft/40 text-rose text-xs font-medium">
              {error}
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}

