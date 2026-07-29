import { differenceInCalendarDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { WrappedPresentation } from "@/components/wrapped/WrappedPresentation";

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

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Relationship Wrapped</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">A year, in a scroll.</h1>
        <p className="text-ink-soft text-sm mt-2">Your story told in numbers, milestones, time capsules, and quiet moments.</p>
      </div>

      <WrappedPresentation
        coupleCode={couple.couple_code}
        daysTogether={daysTogether}
        journalCount={journal.count ?? 0}
        milestoneCount={memories.count ?? 0}
        mediaCount={media.count ?? 0}
        capsuleCount={capsules.count ?? 0}
        bucketDone={bucketDone}
        bucketTotal={bucketItems.length}
      />
    </main>
  );
}

