import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listBucketItems } from "@/lib/services/bucket";
import { BucketListForm } from "@/components/bucket/BucketListForm";
import { BucketListItemRow } from "@/components/bucket/BucketListItem";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function BucketListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const items = await listBucketItems(supabase);
  const completed = items.filter((i) => i.is_completed).length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <main className="px-10 py-10 max-w-3xl">
      <h1 className="font-display text-4xl mb-2">Bucket List</h1>
      <p className="text-ink-soft mb-6">Dreams you're chasing together.</p>

      <GlassCard gradient className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-3xl font-bold">{progress}%</span>
          <span className="text-ink-soft text-sm font-medium">{completed} of {items.length} completed</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </GlassCard>

      <BucketListForm coupleId={couple.id} userId={user.id} />

      <div className="space-y-3">
        {items.map((item) => (
          <BucketListItemRow key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <p className="text-ink-soft text-sm text-center py-10">No dreams yet — add your first one above.</p>
        )}
      </div>
    </main>
  );
}
