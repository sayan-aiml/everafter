import { format, isPast, differenceInDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listTimeCapsules } from "@/lib/services/capsules";
import { CapsuleForm } from "@/components/capsules/CapsuleForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

export default async function CapsulesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const capsules = await listTimeCapsules(supabase);
  const ready = capsules.filter((c) => isPast(new Date(c.unlock_at)));
  const sealed = capsules.filter((c) => !isPast(new Date(c.unlock_at)));

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Time Capsules</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">Letters for later.</h1>
        <p className="text-ink-soft text-sm mt-2">Sealed messages and predictions, unlocked only by time.</p>
      </div>

      <CapsuleForm coupleId={couple.id} userId={user.id} />

      {ready.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✨</span>
            <p className="eyebrow text-magenta font-bold">Unlocked · Ready to Read</p>
          </div>
          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ready.map((c) => (
              <GlassCard key={c.id} tinted className="relative overflow-hidden border-2 border-magenta/30 shadow-glow">
                <div className="flex items-center justify-between mb-3 border-b border-hairline pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💌</span>
                    <h3 className="font-display text-xl font-bold text-ink">{c.title}</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-magenta bg-magenta-glow/40 px-2.5 py-1 rounded-full border border-magenta-soft/40">
                    Unlocked
                  </span>
                </div>
                <p className="font-display text-lg italic text-ink leading-relaxed whitespace-pre-wrap mb-4 bg-paper-pure/70 p-4 rounded-xl border border-hairline/60">
                  "{c.message}"
                </p>
                <p className="text-[11px] font-semibold text-ink-muted text-right">
                  Sealed on {format(new Date(c.created_at), "MMM d, yyyy")} · Unlocked {format(new Date(c.unlock_at), "MMM d, yyyy")}
                </p>
              </GlassCard>
            ))}
          </Reveal>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🕯️</span>
          <p className="eyebrow text-ink-soft font-bold">Sealed · Unlocking in the Future</p>
        </div>
        <Reveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {sealed.map((c) => {
            const daysLeft = differenceInDays(new Date(c.unlock_at), new Date());
            return (
              <GlassCard key={c.id} wax className="relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🔒</span>
                    <span className="text-xs font-bold text-rose bg-rose-blush px-2.5 py-1 rounded-full border border-rose-soft/40">
                      In {daysLeft === 0 ? "1 day" : `${daysLeft} days`}
                    </span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-ink mb-1">{c.title}</h4>
                  <p className="text-xs text-ink-soft italic line-clamp-2">"Sealed letter inside..."</p>
                </div>

                <div className="mt-6 pt-3 border-t border-rose-soft/30 text-[11px] font-semibold text-ink-muted flex items-center justify-between">
                  <span>Opens {format(new Date(c.unlock_at), "MMM d, yyyy")}</span>
                  <span>🔒 Sealed</span>
                </div>
              </GlassCard>
            );
          })}

          {sealed.length === 0 && ready.length === 0 && (
            <div className="col-span-full card p-10 text-center text-ink-soft text-sm">
              No time capsules sealed yet — write your first letter for the future above!
            </div>
          )}
        </Reveal>
      </div>
    </main>
  );
}

