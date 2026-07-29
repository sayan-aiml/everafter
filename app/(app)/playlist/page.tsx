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
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Shared Playlist</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">The soundtrack to us.</h1>
        <p className="text-ink-soft text-sm mt-2">Every melody, anthem, and slow dance song that holds your story.</p>
      </div>

      <PlaylistForm coupleId={couple.id} userId={user.id} />

      <Reveal className="space-y-4">
        {songs.map((s) => (
          <GlassCard key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:shadow-glass">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white text-xl shadow-md shrink-0">
                🎵
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-ink leading-tight">{s.title}</h3>
                {s.artist && <p className="text-xs font-semibold text-magenta mt-0.5">{s.artist}</p>}
                {s.memory_note && (
                  <p className="text-xs text-ink-soft italic mt-2 bg-paper-pure/80 p-2.5 rounded-xl border border-hairline/60">
                    "{s.memory_note}"
                  </p>
                )}
              </div>
            </div>

            {s.spotify_url && (
              <a
                href={s.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full border border-green-300 transition-colors shrink-0"
              >
                <span>▶</span> Listen Track
              </a>
            )}
          </GlassCard>
        ))}

        {songs.length === 0 && (
          <div className="card p-10 text-center text-ink-soft text-sm">
            No songs added yet — add the song playing right now!
          </div>
        )}
      </Reveal>
    </main>
  );
}

