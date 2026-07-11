import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listPlaylistSongs } from "@/lib/services/playlist";
import { PlaylistForm } from "@/components/playlist/PlaylistForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

export default async function PlaylistPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const songs = await listPlaylistSongs(supabase);

  return (
    <main className="px-10 py-10 max-w-3xl">
      <p className="eyebrow mb-2">Shared playlist</p>
      <h1 className="font-display text-5xl mb-8">The soundtrack to us.</h1>

      <PlaylistForm coupleId={couple.id} userId={user.id} />

      <Reveal className="space-y-3">
        {songs.map((s) => (
          <GlassCard key={s.id} className="flex items-center gap-4">
            <span className="text-2xl">🎵</span>
            <div className="flex-1">
              <p className="font-display text-lg">{s.title}</p>
              {s.artist && <p className="text-ink-soft text-sm">{s.artist}</p>}
              {s.memory_note && <p className="text-ink-soft text-xs italic mt-1">"{s.memory_note}"</p>}
            </div>
          </GlassCard>
        ))}
        {songs.length === 0 && (
          <p className="text-ink-soft text-sm text-center py-10">
            No songs yet — add the one playing right now.
          </p>
        )}
      </Reveal>
    </main>
  );
}
