"use client";

import { useState } from "react";
import { format } from "date-fns";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

interface Entry {
  id: string;
  entry_date: string;
  content: string;
  prompt?: string | null;
  mood?: string | null;
  is_private?: boolean;
}

export function JournalList({ entries }: { entries: Entry[] }) {
  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const filtered = entries.filter((e) => {
    const matchesSearch =
      !search.trim() ||
      e.content.toLowerCase().includes(search.toLowerCase()) ||
      (e.prompt && e.prompt.toLowerCase().includes(search.toLowerCase()));
    const matchesMood = !selectedMood || e.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search journal entries..."
          className="input-field flex-1 text-xs sm:text-sm py-2.5"
        />
        <select
          value={selectedMood ?? ""}
          onChange={(e) => setSelectedMood(e.target.value ? e.target.value : null)}
          className="rounded-xl border border-hairline px-3 py-2.5 text-xs text-ink bg-paper-pure outline-none focus:border-magenta"
        >
          <option value="">All Moods</option>
          <option value="quiet">🌙 Quiet</option>
          <option value="soft">🌸 Soft</option>
          <option value="bright">🌼 Bright</option>
          <option value="missing">💙 Missing</option>
          <option value="grateful">⭐ Grateful</option>
          <option value="silly">🤪 Silly</option>
        </select>
      </div>

      <Reveal className="space-y-4">
        {filtered.map((entry) => (
          <GlassCard key={entry.id} className="relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-ink-muted">
                {format(new Date(entry.entry_date), "EEEE, d MMMM yyyy")}
              </p>
              <div className="flex items-center gap-2">
                {entry.is_private && (
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    🔒 Private Note
                  </span>
                )}
                {entry.mood && (
                  <span className="text-xs font-semibold text-magenta bg-magenta-glow/40 px-2.5 py-0.5 rounded-full border border-magenta-soft/30 capitalize">
                    {entry.mood}
                  </span>
                )}
              </div>
            </div>

            {entry.prompt && (
              <p className="text-xs uppercase tracking-wider text-lavender-deep font-bold mb-2">
                Prompt: {entry.prompt}
              </p>
            )}

            <p className="font-display text-xl italic text-ink whitespace-pre-wrap leading-relaxed">
              "{entry.content}"
            </p>
          </GlassCard>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-ink-soft text-sm card p-8">
            No journal entries match your search or filter.
          </div>
        )}
      </Reveal>
    </div>
  );
}
