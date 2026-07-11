"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createBucketItem, type BucketCategory } from "@/lib/services/bucket";
import { Button } from "@/components/ui/Button";

const categories: { value: BucketCategory; label: string; emoji: string }[] = [
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "food", label: "Food", emoji: "🍜" },
  { value: "movies", label: "Movies", emoji: "🎬" },
  { value: "games", label: "Games", emoji: "🎮" },
  { value: "books", label: "Books", emoji: "📚" },
  { value: "other", label: "Other", emoji: "💫" },
];

export function BucketListForm({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BucketCategory>("travel");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createBucketItem(supabase, { couple_id: coupleId, created_by: userId, title, category });
      setTitle("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-ink-soft text-xs font-medium">Dream</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Watch the Northern Lights"
          className="w-full rounded-2xl bg-paper border border-hairline px-4 py-2.5 mt-1 outline-none focus:border-magenta"
        />
      </div>
      <div>
        <label className="text-ink-soft text-xs font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as BucketCategory)}
          className="block rounded-2xl bg-paper border border-hairline px-4 py-2.5 mt-1 outline-none focus:border-magenta"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add Dream"}
      </Button>
    </form>
  );
}
