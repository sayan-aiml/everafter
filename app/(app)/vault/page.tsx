import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listMedia, getMediaUrl } from "@/lib/services/vault";
import { VaultUploader } from "@/components/vault/VaultUploader";

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
    <main className="px-10 py-10 max-w-5xl">
      <h1 className="font-display text-4xl mb-2">Memory Vault</h1>
      <p className="text-ink-soft mb-6">Every photo, video, and voice note — all in one private place.</p>

      <VaultUploader coupleId={couple.id} userId={user.id} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card overflow-hidden aspect-square">
            {item.url && item.media_type === "photo" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.caption ?? ""} className="w-full h-full object-cover" />
            )}
            {item.url && item.media_type === "video" && (
              <video src={item.url} className="w-full h-full object-cover" controls />
            )}
            {item.url && item.media_type === "audio" && (
              <div className="w-full h-full flex items-center justify-center bg-brand-gradient-soft p-4">
                <audio src={item.url} controls className="w-full" />
              </div>
            )}
            {!item.url && (
              <div className="w-full h-full flex items-center justify-center text-ink-soft text-sm">
                Unavailable
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-ink-soft text-sm col-span-full text-center py-10">
            Nothing uploaded yet — drop your first memory above.
          </p>
        )}
      </div>
    </main>
  );
}
