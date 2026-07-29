"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMonths, addYears, format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { createTimeCapsule } from "@/lib/services/capsules";
import { Button } from "@/components/ui/Button";

export function CapsuleForm({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [loading, setLoading] = useState(false);

  function setPresetDate(monthsAhead: number) {
    const target = addMonths(new Date(), monthsAhead);
    setUnlockAt(format(target, "yyyy-MM-dd"));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !unlockAt) return;
    setLoading(true);
    try {
      await createTimeCapsule(supabase, {
        couple_id: coupleId,
        created_by: userId,
        title,
        message,
        unlock_at: new Date(unlockAt).toISOString(),
      });
      setTitle("");
      setMessage("");
      setUnlockAt("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-wax p-6 sm:p-8 mb-8 space-y-4 shadow-floating">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-rose font-bold">🔒 Seal a New Time Capsule</p>
        <span className="text-2xl">🕯️</span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1">Capsule Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Open on our 5th anniversary!"
          required
          className="input-field font-display text-base font-bold"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1">Letter / Message Content</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your secret letter, predictions, or affection for the future..."
          rows={4}
          required
          className="input-field font-display text-base italic resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-2">Unlock Date</label>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() => setPresetDate(6)}
            className="text-xs px-3 py-1.5 rounded-full bg-paper-pure border border-hairline hover:border-magenta text-ink-soft font-semibold transition-colors"
          >
            In 6 Months
          </button>
          <button
            type="button"
            onClick={() => setPresetDate(12)}
            className="text-xs px-3 py-1.5 rounded-full bg-paper-pure border border-hairline hover:border-magenta text-ink-soft font-semibold transition-colors"
          >
            In 1 Year 🎂
          </button>
          <button
            type="button"
            onClick={() => setPresetDate(36)}
            className="text-xs px-3 py-1.5 rounded-full bg-paper-pure border border-hairline hover:border-magenta text-ink-soft font-semibold transition-colors"
          >
            In 3 Years ✨
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="date"
            required
            value={unlockAt}
            onChange={(e) => setUnlockAt(e.target.value)}
            className="input-field flex-1"
          />
          <Button type="submit" loading={loading} variant="primary" size="lg" className="shrink-0 shadow-glow">
            Seal with Wax 🕯️
          </Button>
        </div>
      </div>
    </form>
  );
}

