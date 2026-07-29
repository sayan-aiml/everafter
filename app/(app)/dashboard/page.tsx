import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listJournalEntries } from "@/lib/services/journal";
import { listMemories } from "@/lib/services/memories";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { MoodCheckIn } from "@/components/dashboard/MoodCheckIn";
import { DailyPromptCard } from "@/components/dashboard/DailyPromptCard";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const entries = await listJournalEntries(supabase, { limit: 1 });
  const memories = await listMemories(supabase).catch(() => []);

  const { count: journalCount } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true });

  const { count: capsuleCount } = await supabase
    .from("time_capsules")
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
  const latestMemory = memories[0];

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-6xl mx-auto">
      {/* Header Welcome & Couple Code */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-soft/30 border border-lavender-soft/60 mb-2">
            <span className="h-2 w-2 rounded-full bg-magenta animate-pulse" />
            <span className="eyebrow text-[10px]">
              {daysTogether !== null ? `Day ${daysTogether.toLocaleString()} Together` : "Space Live"}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            Hello, <span className="brand-text">{couple.couple_code.replace("LOVE-", "")}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/journal">
            <button className="px-4 py-2 rounded-full bg-ink text-paper-pure text-xs font-semibold hover:bg-magenta transition-colors shadow-xs">
              + New Entry
            </button>
          </Link>
          <Link href="/memories">
            <button className="px-4 py-2 rounded-full bg-paper-pure border border-hairline text-ink text-xs font-semibold hover:border-magenta hover:text-magenta transition-colors">
              + Milestone
            </button>
          </Link>
        </div>
      </div>

      {/* Top Stats Banner */}
      <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <GlassCard tinted className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-8xl font-bold">❤️</div>
          <p className="eyebrow mb-2">Days Together</p>
          <p className="font-display text-5xl font-bold text-magenta tracking-tight">
            {daysTogether !== null ? daysTogether.toLocaleString() : "—"}
          </p>
          <p className="text-ink-soft text-xs mt-3 font-medium">
            {couple.anniversary_date
              ? `Since ${format(new Date(couple.anniversary_date), "MMMM d, yyyy")}`
              : "Set anniversary in Settings →"}
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <p className="eyebrow mb-2">Total Journal Entries</p>
            <p className="font-display text-5xl font-bold text-lavender-deep tracking-tight">
              {journalCount ?? 0}
            </p>
          </div>
          <p className="text-ink-soft text-xs mt-3">Reflections in your space</p>
        </GlassCard>

        <GlassCard>
          <MoodCheckIn coupleId={couple.id} userId={user.id} todaysMood={myMood?.mood ?? null} />
        </GlassCard>
      </Reveal>

      {/* Prompt Shuffling & Latest Journal Row */}
      <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <DailyPromptCard />

        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="eyebrow">♡ Latest Journal Entry</p>
              <Link href="/journal" className="text-xs text-magenta font-semibold hover:underline">
                View all →
              </Link>
            </div>
            {latestEntry ? (
              <div>
                <p className="font-display text-xl italic leading-snug text-ink">"{latestEntry.content}"</p>
                <p className="text-ink-soft text-xs mt-4 font-medium">
                  Written on {format(new Date(latestEntry.entry_date), "EEEE, MMM d")}
                  {latestEntry.mood ? ` · Mood: ${latestEntry.mood}` : ""}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center text-ink-soft text-sm">
                No journal entries written yet — write your first note!
              </div>
            )}
          </div>
        </GlassCard>
      </Reveal>

      {/* Quick Launchers Grid */}
      <Reveal className="mb-8">
        <p className="eyebrow mb-4">Quick Feature Launchers</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/memories">
            <GlassCard hoverGlow className="text-center p-5">
              <span className="text-3xl mb-2 block">🗓️</span>
              <p className="font-display text-base font-bold">Timeline</p>
              <p className="text-[11px] text-ink-soft mt-1">Milestones & firsts</p>
            </GlassCard>
          </Link>

          <Link href="/capsules">
            <GlassCard hoverGlow className="text-center p-5 relative">
              <span className="text-3xl mb-2 block">🔒</span>
              <p className="font-display text-base font-bold">Capsules</p>
              <p className="text-[11px] text-ink-soft mt-1">{capsuleCount ?? 0} sealed letters</p>
            </GlassCard>
          </Link>

          <Link href="/playlist">
            <GlassCard hoverGlow className="text-center p-5">
              <span className="text-3xl mb-2 block">🎵</span>
              <p className="font-display text-base font-bold">Soundtrack</p>
              <p className="text-[11px] text-ink-soft mt-1">Our shared songs</p>
            </GlassCard>
          </Link>

          <Link href="/wrapped">
            <GlassCard hoverGlow className="text-center p-5">
              <span className="text-3xl mb-2 block">🎁</span>
              <p className="font-display text-base font-bold">Wrapped</p>
              <p className="text-[11px] text-ink-soft mt-1">Annual recap</p>
            </GlassCard>
          </Link>
        </div>
      </Reveal>

      {/* Recent Milestone Stream */}
      {latestMemory && (
        <Reveal>
          <GlassCard tinted className="p-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="eyebrow text-magenta mb-1">Most Recent Milestone</p>
                <h4 className="font-display text-2xl font-bold">{latestMemory.title}</h4>
                {latestMemory.description && (
                  <p className="text-ink-soft text-sm mt-1">{latestMemory.description}</p>
                )}
                <p className="text-xs font-semibold text-ink-muted mt-2">
                  {format(new Date(latestMemory.memory_date), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      )}
    </main>
  );
}

