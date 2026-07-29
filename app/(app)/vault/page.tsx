import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listMedia, getMediaUrl } from "@/lib/services/vault";
import { VaultUploader } from "@/components/vault/VaultUploader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

export default async function VaultPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const media = await listMedia(supabase);
  const items = await Promise.all(
    media.map(async (m) => ({
      ...m,
      url: await getMediaUrl(supabase, m.storage_path).catch(() => null),
    }))
  );

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Memory Vault</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">Polymorphic Vault.</h1>
        <p className="text-ink-soft text-sm mt-2">Every photo, video, and voice note — encrypted & sealed in one private gallery.</p>
      </div>

      <VaultUploader coupleId={couple.id} userId={user.id} />

      <Reveal className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden group aspect-square flex flex-col justify-between relative shadow-editorial hover:shadow-floating transition-all">
            {item.url && item.media_type === "photo" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.caption ?? "Vault photo"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {item.url && item.media_type === "video" && (
              <video src={item.url} className="w-full h-full object-cover" controls />
            )}

            {item.url && item.media_type === "audio" && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-brand-gradient-soft p-4 text-center">
                <span className="text-4xl mb-2 animate-bounce">🎙️</span>
                <audio src={item.url} controls className="w-full max-w-[90%]" />
              </div>
            )}

            {!item.url && (
              <div className="w-full h-full flex items-center justify-center bg-paper-pure text-ink-muted text-xs font-semibold p-4 text-center">
                Media Unavailable
              </div>
            )}

            {item.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-ink/70 backdrop-blur-xs p-2 text-white text-[11px] truncate">
                {item.caption}
              </div>
            )}
          </GlassCard>
        ))}

        {items.length === 0 && (
          <div className="col-span-full card p-12 text-center text-ink-soft text-sm">
            Nothing uploaded to your vault yet — drop your first memory photo or video above!
          </div>
        )}
      </Reveal>
    </main>
  );
}

