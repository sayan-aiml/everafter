"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addPlaylistSong } from "@/lib/services/playlist";
import { Button } from "@/components/ui/Button";

export function PlaylistForm({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await addPlaylistSong(supabase, {
        couple_id: coupleId,
        added_by: userId,
        title,
        artist: artist || undefined,
        memory_note: note || undefined,
      });
      setTitle("");
      setArtist("");
      setNote("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-3">
      <p className="eyebrow">Add a song</p>
      <div className="flex gap-3 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song title"
          className="flex-1 min-w-[160px] rounded-xl border border-hairline px-4 py-2.5 outline-none focus:border-magenta"
        />
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist"
          className="flex-1 min-w-[160px] rounded-xl border border-hairline px-4 py-2.5 outline-none focus:border-magenta"
        />
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="The memory attached to this song…"
        className="w-full rounded-xl border border-hairline px-4 py-2.5 outline-none focus:border-magenta"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add to Playlist"}
      </Button>
    </form>
  );
}
