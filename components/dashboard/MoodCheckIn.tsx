"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clsx } from "clsx";

const moods = [
  { value: "quiet", label: "Quiet", emoji: "🌙" },
  { value: "soft", label: "Soft", emoji: "🌸" },
  { value: "bright", label: "Bright", emoji: "🌼" },
  { value: "missing", label: "Missing", emoji: "💙" },
  { value: "grateful", label: "Grateful", emoji: "⭐" },
];

export function MoodCheckIn({
  coupleId,
  userId,
  todaysMood,
}: {
  coupleId: string;
  userId: string;
  todaysMood: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [selected, setSelected] = useState(todaysMood);
  const [loading, setLoading] = useState(false);

  async function handleSelect(mood: string) {
    setLoading(true);
    setSelected(mood);
    await supabase.from("mood_checkins").upsert(
      { couple_id: coupleId, user_id: userId, mood, checkin_date: new Date().toISOString().slice(0, 10) },
      { onConflict: "user_id,checkin_date" }
    );
    setLoading(false);
    router.refresh();
  }

  const activeMoodObj = moods.find((m) => m.value === selected);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow">Mood check-in</p>
        {activeMoodObj && (
          <span className="text-xs font-semibold text-magenta bg-magenta-glow/40 px-2.5 py-0.5 rounded-full border border-magenta-soft/30">
            {activeMoodObj.emoji} {activeMoodObj.label}
          </span>
        )}
      </div>

      <p className="text-xs text-ink-soft mb-4">How are you feeling in your heart today?</p>

      <div className="flex gap-2.5 flex-wrap">
        {moods.map((m) => (
          <button
            key={m.value}
            disabled={loading}
            onClick={() => handleSelect(m.value)}
            className={clsx(
              "flex-1 min-w-[50px] py-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 focus:outline-none",
              selected === m.value
                ? "border-magenta bg-brand-gradient-soft shadow-sm scale-105"
                : "border-hairline bg-paper-pure/60 hover:border-lavender-soft hover:bg-lavender-soft/20"
            )}
          >
            <span className="text-xl">{m.emoji}</span>
            <span className="text-[10px] font-semibold text-ink-soft">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

