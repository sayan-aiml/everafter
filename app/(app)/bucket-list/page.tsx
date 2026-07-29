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
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Bucket List</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">Dreams for two.</h1>
        <p className="text-ink-soft text-sm mt-2">Every adventure, trip, and quiet milestone you want to achieve together.</p>
      </div>

      <GlassCard tinted className="mb-8 p-6 shadow-glass">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="eyebrow text-magenta mb-0.5">Progress Tracker</p>
            <span className="font-display text-4xl font-extrabold text-ink">{progress}%</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-lavender-deep bg-lavender-soft/40 px-3 py-1 rounded-full border border-lavender-soft">
              {completed} of {items.length} Dreams Achieved ✨
            </span>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill shadow-glow" style={{ width: `${progress}%` }} />
        </div>
      </GlassCard>

      <BucketListForm coupleId={couple.id} userId={user.id} />

      <div className="space-y-3">
        {items.map((item) => (
          <BucketListItemRow key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <div className="card p-10 text-center text-ink-soft text-sm">
            No dreams added yet — write your first bucket list goal above!
          </div>
        )}
      </div>
    </main>
  );
}

