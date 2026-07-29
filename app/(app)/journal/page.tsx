import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listJournalEntries } from "@/lib/services/journal";
import { JournalComposer } from "@/components/journal/JournalComposer";
import { JournalList } from "@/components/journal/JournalList";

export default async function JournalPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const entries = await listJournalEntries(supabase, { limit: 100 });

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Couple Journal</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">Words for us.</h1>
        <p className="text-ink-soft text-sm mt-2">Daily prompts and private reflections, forever preserved.</p>
      </div>

      <JournalComposer coupleId={couple.id} userId={user.id} />
      <JournalList entries={entries} />
    </main>
  );
}

