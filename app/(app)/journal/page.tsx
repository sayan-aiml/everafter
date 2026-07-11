import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listJournalEntries } from "@/lib/services/journal";
import { JournalComposer } from "@/components/journal/JournalComposer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

export default async function JournalPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const entries = await listJournalEntries(supabase, { limit: 50 });

  return (
    <main className="px-10 py-10 max-w-3xl">
      <p className="eyebrow mb-2">Couple journal</p>
      <h1 className="font-display text-5xl mb-8">Words for us.</h1>

      <JournalComposer coupleId={couple.id} userId={user.id} />

      <Reveal className="space-y-4">
        {entries.map((entry) => (
          <GlassCard key={entry.id}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-ink-soft">
                {format(new Date(entry.entry_date), "EEE, d MMM")}
                {entry.mood && <span className="text-magenta ml-2">· {entry.mood}</span>}
              </p>
            </div>
            {entry.prompt && (
              <p className="text-xs uppercase tracking-wider text-lavender-deep font-medium mb-1">
                {entry.prompt}
              </p>
            )}
            <p className="font-display text-lg italic text-ink whitespace-pre-wrap leading-snug">
              {entry.content}
            </p>
          </GlassCard>
        ))}
        {entries.length === 0 && (
          <p className="text-ink-soft text-sm text-center py-10">
            No entries yet — write your first one above.
          </p>
        )}
      </Reveal>
    </main>
  );
}
