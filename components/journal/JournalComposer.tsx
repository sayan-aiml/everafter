"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createJournalEntry } from "@/lib/services/journal";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

const moods = ["quiet", "soft", "bright", "missing", "grateful", "silly"];

export function JournalComposer({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
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
        prompt: "What made you smile today?",
      });
      setContent("");
      setMood(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8">
      <p className="eyebrow mb-3">A new entry</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What do you want to remember about today?"
        rows={3}
        className="w-full rounded-xl border border-hairline px-4 py-3 outline-none focus:border-magenta resize-none font-display text-lg"
      />
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(mood === m ? null : m)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs border transition-colors",
                mood === m
                  ? "bg-brand-gradient text-white border-transparent"
                  : "border-hairline text-ink-soft hover:border-lavender-soft"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
