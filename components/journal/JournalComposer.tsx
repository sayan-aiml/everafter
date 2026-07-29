"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createJournalEntry } from "@/lib/services/journal";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

const moods = [
  { value: "quiet", emoji: "🌙" },
  { value: "soft", emoji: "🌸" },
  { value: "bright", emoji: "🌼" },
  { value: "missing", emoji: "💙" },
  { value: "grateful", emoji: "⭐" },
  { value: "silly", emoji: "🤪" },
];

const samplePrompts = [
  "What made you smile about us today?",
  "What is a small detail about today you never want to forget?",
  "What is one thing you appreciate about your partner right now?",
  "Custom Entry",
];

export function JournalComposer({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState(samplePrompts[0]);
  const [mood, setMood] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createJournalEntry(supabase, {
        couple_id: coupleId,
        author_id: userId,
        content,
        mood: mood ?? undefined,
        prompt: prompt === "Custom Entry" ? undefined : prompt,
        is_private: isPrivate,
      });
      setContent("");
      setMood(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 shadow-editorial hover:shadow-glass transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="eyebrow">A new entry</p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-ink-soft cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="accent-magenta rounded"
            />
            <span>{isPrivate ? "🔒 Private (Only Me)" : "👥 Shared with Partner"}</span>
          </label>
        </div>
      </div>

      <div className="mb-3">
        <select
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full text-xs font-semibold text-magenta bg-lavender-soft/20 border border-lavender-soft/50 rounded-xl px-3 py-2 outline-none"
        >
          {samplePrompts.map((p) => (
            <option key={p} value={p}>
              Prompt: {p}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts, memories, or reflections for today..."
        rows={4}
        className="w-full rounded-xl border border-hairline p-4 outline-none focus:border-magenta resize-none font-display text-lg bg-paper-pure/80"
      />

      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-ink-muted mr-1 font-semibold">Mood:</span>
          {moods.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(mood === m.value ? null : m.value)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs border transition-all flex items-center gap-1",
                mood === m.value
                  ? "bg-brand-gradient text-white border-transparent shadow-xs scale-105 font-bold"
                  : "border-hairline bg-paper-pure text-ink-soft hover:border-lavender-soft"
              )}
            >
              <span>{m.emoji}</span>
              <span className="capitalize">{m.value}</span>
            </button>
          ))}
        </div>

        <Button type="submit" loading={loading} size="md">
          Save Entry ✨
        </Button>
      </div>
    </form>
  );
}

