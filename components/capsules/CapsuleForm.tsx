"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-3">
      <p className="text-ink-soft text-xs uppercase tracking-widest">Lock a New Capsule</p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Open on our 5th anniversary"
        className="w-full rounded-xl bg-paper border border-hairline px-4 py-3 outline-none focus:border-magenta"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your letter…"
        rows={3}
        className="w-full rounded-xl bg-paper border border-hairline px-4 py-3 outline-none focus:border-magenta resize-none"
      />
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={unlockAt}
          onChange={(e) => setUnlockAt(e.target.value)}
          className="rounded-xl bg-paper border border-hairline px-4 py-2.5 outline-none focus:border-magenta"
        />
        <Button type="submit" disabled={loading} className="ml-auto">
          {loading ? "Locking…" : "Lock Capsule"}
        </Button>
      </div>
    </form>
  );
}
