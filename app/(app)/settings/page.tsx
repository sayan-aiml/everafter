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
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
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
    const { error } = await supabase
      .from("couples")
      .update({ anniversary_date: anniversaryDate || null })
      .eq("id", coupleId);
    setSaving(false);
    setStatus(error ? error.message : "✓ Settings saved successfully.");
  }

  function handleCopyCode() {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function handleExportData() {
    setExporting(true);
    try {
      const [journal, memories, capsules, bucket, playlist, pins] = await Promise.all([
        supabase.from("journal_entries").select("*"),
        supabase.from("memories").select("*"),
        supabase.from("time_capsules").select("*"),
        supabase.from("bucket_list_items").select("*"),
        supabase.from("playlist_songs").select("*"),
        supabase.from("travel_pins").select("*"),
      ]);

      const exportBundle = {
        exported_at: new Date().toISOString(),
        couple_id: coupleId,
        anniversary_date: anniversaryDate,
        journal_entries: journal.data ?? [],
        memories: memories.data ?? [],
        time_capsules: capsules.data ?? [],
        bucket_list: bucket.data ?? [],
        playlist: playlist.data ?? [],
        travel_pins: pins.data ?? [],
      };

      const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `everafter-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <main className="px-6 sm:px-10 py-12 text-center text-ink-soft text-sm">
        Loading settings…
      </main>
    );
  }

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Space Settings</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">Your space.</h1>
        <p className="text-ink-soft text-sm mt-2">Manage your anniversary, invite code, partner pairing, and data export.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <GlassCard className="shadow-editorial">
          <label className="text-xs font-bold uppercase tracking-wider text-magenta block mb-1">
            Anniversary Date
          </label>
          <p className="text-ink-soft text-xs mb-4">
            Powers the "Days Together" counter across your home dashboard, sidebar, and Relationship Wrapped.
          </p>
          <input
            type="date"
            value={anniversaryDate}
            onChange={(e) => setAnniversaryDate(e.target.value)}
            className="input-field max-w-xs font-semibold"
          />
        </GlassCard>

        <GlassCard tinted className="shadow-editorial">
          <label className="text-xs font-bold uppercase tracking-wider text-magenta block mb-1">
            Partner Invite Code
          </label>
          <p className="text-ink-soft text-xs mb-3">
            Share this secret 1-click invite code with your partner so they can pair into this space:
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-paper-pure border border-magenta/40">
            <span className="font-display text-2xl brand-text tracking-widest font-bold">
              {inviteCode || "No active code"}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-4 py-2 rounded-full bg-magenta/10 hover:bg-magenta/20 text-magenta text-xs font-bold transition-colors shrink-0"
            >
              {copied ? "✓ Copied!" : "📋 Copy Invite Code"}
            </button>
          </div>
        </GlassCard>

        <div className="flex items-center justify-between pt-2">
          <Button type="submit" loading={saving} size="lg">
            Save Settings ✨
          </Button>

          {status && <span className="text-xs font-semibold text-magenta">{status}</span>}
        </div>
      </form>

      {/* Data Sovereignty & Export Section */}
      <div className="mt-12 pt-8 border-t border-hairline">
        <h3 className="font-display text-xl font-bold mb-1">Data Ownership & Export</h3>
        <p className="text-ink-soft text-xs mb-4">
          You retain 100% ownership of your relationship history. Download a complete JSON backup anytime.
        </p>

        <Button variant="outline" onClick={handleExportData} loading={exporting} size="md">
          📦 Download Complete JSON Backup
        </Button>
      </div>
    </main>
  );
}

