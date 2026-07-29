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
  const [spotifyUrl, setSpotifyUrl] = useState("");
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
        spotify_url: spotifyUrl || undefined,
        memory_note: note || undefined,
      });
      setTitle("");
      setArtist("");
      setSpotifyUrl("");
      setNote("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-3.5 shadow-editorial hover:shadow-glass transition-all">
      <div className="flex items-center justify-between">
        <p className="eyebrow">🎵 Add a Track to Your Shared Soundtrack</p>
        <span className="text-xl">🎶</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Song Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lover"
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Artist Name</label>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Taylor Swift"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1">Spotify / Apple Music / YouTube URL (Optional)</label>
        <input
          type="url"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          placeholder="https://open.spotify.com/track/..."
          className="input-field text-xs font-mono"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1">Memory Story ("This was playing when...")</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. This was playing on our first road trip to the beach!"
          className="input-field font-display italic"
        />
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" loading={loading} size="md">
          Add Song to Playlist 🎵
        </Button>
      </div>
    </form>
  );
}

