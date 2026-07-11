"use client";

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

  async function handleToggle() {
    await toggleBucketItem(supabase, item.id, !item.is_completed);
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className={clsx(
        "w-full flex items-center gap-3 card p-4 text-left transition-all hover:shadow-glow",
        item.is_completed && "opacity-50"
      )}
    >
      <span
        className={clsx(
          "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0",
          item.is_completed ? "bg-brand-gradient border-transparent text-ink" : "border-lavender-soft"
        )}
      >
        {item.is_completed && "✓"}
      </span>
      <span className="text-xl">{emojiFor[item.category] ?? "💫"}</span>
      <span className={clsx("flex-1 font-medium", item.is_completed && "line-through")}>{item.title}</span>
    </button>
  );
}
