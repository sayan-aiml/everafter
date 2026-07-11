import { differenceInCalendarDays, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listJournalEntries } from "@/lib/services/journal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { MoodCheckIn } from "@/components/dashboard/MoodCheckIn";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const entries = await listJournalEntries(supabase, { limit: 1 });
  const { count: journalCount } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true });

  const today = new Date().toISOString().slice(0, 10);
  const { data: myMood } = await supabase
    .from("mood_checkins")
    .select("mood")
    .eq("user_id", user.id)
    .eq("checkin_date", today)
    .maybeSingle();

  const daysTogether = couple.anniversary_date
    ? differenceInCalendarDays(new Date(), new Date(couple.anniversary_date))
    : null;

  const latestEntry = entries[0];

  return (
    <main className="px-10 py-10 max-w-5xl">
      <p className="eyebrow mb-2">
        EverAfter {daysTogether !== null ? `· Day ${daysTogether}` : ""}
      </p>
      <h1 className="font-display text-5xl mb-10">
        Hello, <span className="brand-text italic">{couple.couple_code.replace("LOVE-", "")}</span>
      </h1>

      <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-ink-soft mb-2">Days Together</p>
          <p className="font-display text-5xl text-magenta">
            {daysTogether !== null ? daysTogether.toLocaleString() : "—"}
          </p>
          <p className="text-ink-soft text-xs mt-2">
            {couple.anniversary_date
              ? `since ${format(new Date(couple.anniversary_date), "d MMM yyyy")}`
              : "Set it in Settings"}
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-ink-soft mb-2">Journal Entries</p>
          <p className="font-display text-5xl text-lavender-deep">{journalCount ?? 0}</p>
          <p className="text-ink-soft text-xs mt-2">this space</p>
        </GlassCard>

        <GlassCard tinted>
          <MoodCheckIn coupleId={couple.id} userId={user.id} todaysMood={myMood?.mood ?? null} />
        </GlassCard>
      </Reveal>

      <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <GlassCard>
          <p className="eyebrow mb-3">✦ Today's question</p>
          <p className="font-display text-2xl mb-2">What made you smile today?</p>
          <a href="/journal" className="text-sm text-magenta font-medium hover:underline">
            Answer in journal →
          </a>
        </GlassCard>

        <GlassCard>
          <p className="eyebrow mb-3">♡ Latest journal</p>
          {latestEntry ? (
            <>
              <p className="font-display text-lg italic leading-snug">"{latestEntry.content}"</p>
              <p className="text-ink-soft text-xs mt-3">
                {format(new Date(latestEntry.entry_date), "EEEE, d MMM")}
                {latestEntry.mood ? ` · ${latestEntry.mood}` : ""}
              </p>
            </>
          ) : (
            <p className="text-ink-soft text-sm">No entries yet — write your first one.</p>
          )}
        </GlassCard>
      </Reveal>
    </main>
  );
}
