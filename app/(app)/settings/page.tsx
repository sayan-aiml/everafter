"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function SettingsPage() {
  const supabase = createClient();
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("couples").select("*").maybeSingle();
      if (data) {
        setCoupleId(data.id);
        setAnniversaryDate(data.anniversary_date ?? "");
        setInviteCode(data.invite_code ?? "");
      }
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!coupleId) return;
    setSaving(true);
    setStatus(null);
    // RLS: couples_update_member policy already allows this — id = current_couple_id().
    const { error } = await supabase
      .from("couples")
      .update({ anniversary_date: anniversaryDate || null })
      .eq("id", coupleId);
    setSaving(false);
    setStatus(error ? error.message : "Saved.");
  }

  if (loading) return <main className="px-10 py-10 text-ink-soft text-sm">Loading…</main>;

  return (
    <main className="px-10 py-10 max-w-2xl">
      <p className="eyebrow mb-2">Settings</p>
      <h1 className="font-display text-4xl mb-8">Your space.</h1>

      <form onSubmit={handleSave}>
        <GlassCard className="mb-6">
          <label className="text-xs font-medium text-ink-soft block mb-2">Anniversary date</label>
          <p className="text-ink-soft text-sm mb-3">
            Powers the "Days Together" counter across your dashboard and Wrapped.
          </p>
          <input
            type="date"
            value={anniversaryDate}
            onChange={(e) => setAnniversaryDate(e.target.value)}
            className="rounded-xl border border-hairline px-4 py-2.5 outline-none focus:border-magenta"
          />
        </GlassCard>

        <GlassCard tinted className="mb-6">
          <label className="text-xs font-medium text-ink-soft block mb-2">Invite code</label>
          <p className="text-ink-soft text-sm mb-3">Share this with your partner so they can join your space.</p>
          <div className="font-display text-2xl brand-text tracking-widest">{inviteCode}</div>
        </GlassCard>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {status && <span className="text-sm text-ink-soft">{status}</span>}
        </div>
      </form>
    </main>
  );
}
