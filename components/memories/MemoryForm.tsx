"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createMemory } from "@/lib/services/memories";
import { Button } from "@/components/ui/Button";
import type { MemoryType } from "@/types/database";

const types: { value: MemoryType; label: string }[] = [
  { value: "first_text", label: "First Text" },
  { value: "first_call", label: "First Call" },
  { value: "first_date", label: "First Date" },
  { value: "first_meet", label: "First Meet" },
  { value: "birthday", label: "Birthday" },
  { value: "trip", label: "Trip" },
  { value: "anniversary", label: "Anniversary" },
  { value: "milestone", label: "Milestone" },
];

export function MemoryForm({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<MemoryType>("milestone");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setLoading(true);
    try {
      await createMemory(supabase, { couple_id: coupleId, created_by: userId, title, type, memory_date: date });
      setTitle("");
      setDate("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[180px]">
        <label className="text-ink-soft text-xs">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Our first trip to Kyoto"
          className="w-full rounded-xl border border-hairline px-4 py-2.5 mt-1 outline-none focus:border-magenta"
        />
      </div>
      <div>
        <label className="text-ink-soft text-xs">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MemoryType)}
          className="block rounded-xl border border-hairline px-4 py-2.5 mt-1 outline-none focus:border-magenta"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-ink-soft text-xs">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block rounded-xl border border-hairline px-4 py-2.5 mt-1 outline-none focus:border-magenta"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add Memory"}
      </Button>
    </form>
  );
}
