"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clsx } from "clsx";

const moods = [
  { value: "quiet", emoji: "🌙" },
  { value: "soft", emoji: "🌸" },
  { value: "bright", emoji: "🌼" },
  { value: "missing", emoji: "💙" },
  { value: "grateful", emoji: "⭐" },
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
    // Upsert on (user_id, checkin_date) — one check-in per person per day.
    await supabase.from("mood_checkins").upsert(
      { couple_id: coupleId, user_id: userId, mood, checkin_date: new Date().toISOString().slice(0, 10) },
      { onConflict: "user_id,checkin_date" }
    );
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <p className="eyebrow mb-4">Mood check-in</p>
      <div className="flex gap-2 flex-wrap">
        {moods.map((m) => (
          <button
            key={m.value}
            disabled={loading}
            onClick={() => handleSelect(m.value)}
            className={clsx(
              "h-14 w-14 rounded-full border flex flex-col items-center justify-center text-lg transition-all",
              selected === m.value
                ? "border-magenta bg-lavender-soft/30 scale-105"
                : "border-hairline hover:border-lavender-soft"
            )}
            title={m.value}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
