import { differenceInCalendarDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

// Computed live from real data rather than a precomputed snapshot — fine at
// this scale. For production at high volume, move this to a scheduled job
// writing into `wrapped_snapshots` (see docs/ROADMAP.md) so this page is a
// fast read instead of five aggregate queries per view.
export default async function WrappedPage() {
  const supabase = createClient();
  const couple = await getMyCouple(supabase);
  if (!couple) return null;

  const [journal, memories, capsules, bucket, media] = await Promise.all([
    supabase.from("journal_entries").select("*", { count: "exact", head: true }),
    supabase.from("memories").select("*", { count: "exact", head: true }),
    supabase.from("time_capsules").select("*", { count: "exact", head: true }),
    supabase.from("bucket_list_items").select("is_completed"),
    supabase.from("media").select("*", { count: "exact", head: true }),
  ]);

  const daysTogether = couple.anniversary_date
    ? differenceInCalendarDays(new Date(), new Date(couple.anniversary_date))
    : 0;

  const bucketItems = bucket.data ?? [];
  const bucketDone = bucketItems.filter((b) => b.is_completed).length;

  const stats = [
    { label: "Days Together", value: daysTogether.toLocaleString(), color: "text-magenta" },
    { label: "Journal Entries", value: journal.count ?? 0, color: "text-lavender-deep" },
    { label: "Milestones", value: memories.count ?? 0, color: "text-magenta-deep" },
    { label: "Photos & Videos", value: media.count ?? 0, color: "text-lavender" },
    { label: "Capsules Sealed", value: capsules.count ?? 0, color: "text-magenta" },
    { label: "Bucket List", value: `${bucketDone}/${bucketItems.length}`, color: "text-lavender-deep" },
  ];

  return (
    <main className="px-10 py-10 max-w-4xl">
      <p className="eyebrow mb-2">Relationship wrapped</p>
      <h1 className="font-display text-5xl mb-2">A year, in a scroll.</h1>
      <p className="text-ink-soft mb-8">Your story, told in numbers, songs, and small moments.</p>

      <div className="card-tinted p-14 text-center mb-8">
        <p className="eyebrow mb-4">{new Date().getFullYear()} · Together</p>
        <p className="font-display text-6xl mb-3">
          <span className="brand-text">{couple.couple_code.replace("LOVE-", "")}</span>
        </p>
        <p className="text-ink-soft text-sm">A private wrapped, just for you two.</p>
      </div>

      <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <GlassCard key={s.label} className="text-center">
            <div className="h-1 w-8 bg-brand-gradient rounded-full mx-auto mb-4" />
            <p className={`font-display text-4xl mb-2 ${s.color}`}>{s.value}</p>
            <p className="text-xs uppercase tracking-widest text-ink-soft">{s.label}</p>
          </GlassCard>
        ))}
      </Reveal>
    </main>
  );
}
