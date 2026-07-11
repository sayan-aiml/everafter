"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateCoupleSettings, updateProfile } from "@/lib/services/settings";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Couple, Profile } from "@/types/database";

export function SettingsForm({ couple, profile }: { couple: Couple; profile: Profile }) {
  const supabase = createClient();
  const router = useRouter();
  const [anniversary, setAnniversary] = useState(couple.anniversary_date ?? "");
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await Promise.all([
        updateCoupleSettings(supabase, couple.id, { anniversary_date: anniversary || null }),
        updateProfile(supabase, profile.id, { display_name: displayName, city }),
      ]);
      setSaved(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <GlassCard>
        <div className="accent-bar" />
        <p className="text-ivory/50 text-xs uppercase tracking-widest mb-4 font-semibold">
          Relationship
        </p>
        <label className="text-ivory/50 text-xs font-medium">Anniversary Date</label>
        <input
          type="date"
          value={anniversary}
          onChange={(e) => setAnniversary(e.target.value)}
          className="w-full rounded-2xl bg-white/[0.04] border border-line px-4 py-3 mt-1 outline-none focus:border-magenta text-ivory"
        />
        <p className="text-ivory/30 text-xs mt-2">Powers the "Days Together" counter on your dashboard.</p>
      </GlassCard>

      <GlassCard>
        <div className="accent-bar" />
        <p className="text-ivory/50 text-xs uppercase tracking-widest mb-4 font-semibold">
          Your Profile
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-ivory/50 text-xs font-medium">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How your partner sees you"
              className="w-full rounded-2xl bg-white/[0.04] border border-line px-4 py-3 mt-1 outline-none focus:border-magenta text-ivory"
            />
          </div>
          <div>
            <label className="text-ivory/50 text-xs font-medium">Your City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bangalore"
              className="w-full rounded-2xl bg-white/[0.04] border border-line px-4 py-3 mt-1 outline-none focus:border-magenta text-ivory"
            />
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save Changes"}
        </Button>
        {saved && <span className="text-lavender-soft text-sm">Saved ✓</span>}
      </div>
    </form>
  );
}
