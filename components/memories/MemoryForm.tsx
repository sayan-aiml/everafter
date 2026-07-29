"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createMemory } from "@/lib/services/memories";
import { Button } from "@/components/ui/Button";
import type { MemoryType } from "@/types/database";

const types: { value: MemoryType; label: string; emoji: string }[] = [
  { value: "first_meet", label: "First Meet", emoji: "✨" },
  { value: "first_date", label: "First Date", emoji: "🌙" },
  { value: "first_text", label: "First Text", emoji: "💬" },
  { value: "first_call", label: "First Call", emoji: "📞" },
  { value: "trip", label: "Trip", emoji: "✈️" },
  { value: "anniversary", label: "Anniversary", emoji: "💫" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "milestone", label: "Milestone", emoji: "⭐" },
];

export function MemoryForm({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MemoryType>("first_date");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setLoading(true);
    try {
      await createMemory(supabase, {
        couple_id: coupleId,
        created_by: userId,
        title,
        description: description || undefined,
        type,
        memory_date: date,
      });
      setTitle("");
      setDescription("");
      setDate("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-3.5 shadow-editorial hover:shadow-glass transition-all">
      <div className="flex items-center justify-between">
        <p className="eyebrow">🗓️ Add a Milestone to Your Timeline</p>
        <span className="text-xl">✨</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink-soft mb-1">Milestone Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Our First Date at Sunset Beach"
            required
            className="input-field font-display text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Category</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MemoryType)}
            className="input-field font-medium"
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink-soft mb-1">Description / Story (Optional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="We talked for 4 hours until the coffee shop closed..."
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" loading={loading} size="md">
          Add Milestone ✨
        </Button>
      </div>
    </form>
  );
}

