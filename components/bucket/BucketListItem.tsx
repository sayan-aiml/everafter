"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toggleBucketItem } from "@/lib/services/bucket";
import { clsx } from "clsx";

const emojiFor: Record<string, string> = {
  travel: "✈️", food: "🍜", movies: "🎬", games: "🎮", books: "📚", other: "💫",
};

export function BucketListItemRow({ item }: { item: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleBucketItem(supabase, item.id, !item.is_completed);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={handleToggle}
      className={clsx(
        "w-full flex items-center justify-between gap-3 card p-4 text-left transition-all duration-200 cursor-pointer select-none hover:shadow-glass hover:border-magenta-soft/60",
        item.is_completed && "bg-lavender-soft/10 border-hairline/60"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span
          className={clsx(
            "h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all text-xs font-bold",
            item.is_completed
              ? "bg-brand-gradient border-transparent text-white shadow-xs scale-105"
              : "border-hairline hover:border-magenta bg-paper-pure"
          )}
        >
          {item.is_completed && "✓"}
        </span>

        <span className="text-2xl shrink-0">{emojiFor[item.category] ?? "💫"}</span>

        <span
          className={clsx(
            "font-display text-base font-semibold text-ink truncate transition-all",
            item.is_completed && "line-through text-ink-muted italic font-normal"
          )}
        >
          {item.title}
        </span>
      </div>

      <span className="text-[10px] uppercase font-bold text-magenta bg-lavender-soft/30 px-2.5 py-1 rounded-full border border-lavender-soft/50 shrink-0">
        {item.category}
      </span>
    </div>
  );
}

