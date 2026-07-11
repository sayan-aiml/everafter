import { format, isPast } from "date-fns";
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
    <main className="px-10 py-10 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="eyebrow mb-2">Time capsules</p>
          <h1 className="font-display text-5xl mb-2">Letters for later.</h1>
          <p className="text-ink-soft">Sealed messages, unlocked by time.</p>
        </div>
      </div>

      <CapsuleForm coupleId={couple.id} userId={user.id} />

      {ready.length > 0 && (
        <div className="mb-10">
          <p className="eyebrow mb-4">Ready to open</p>
          <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ready.map((c) => (
              <GlassCard key={c.id} tinted>
                <p className="text-2xl mb-2">✨</p>
                <p className="font-display text-lg mb-3">{c.title}</p>
                <p className="text-ink-soft text-sm whitespace-pre-wrap">{c.message}</p>
              </GlassCard>
            ))}
          </Reveal>
        </div>
      )}

      <div>
        <p className="eyebrow mb-4">Sealed · unlocking later</p>
        <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sealed.map((c) => (
            <GlassCard key={c.id}>
              <p className="text-2xl mb-2">🔒</p>
              <p className="font-display text-lg mb-1">{c.title}</p>
              <p className="text-ink-soft text-xs">Opens {format(new Date(c.unlock_at), "d MMM yyyy")}</p>
            </GlassCard>
          ))}
          {sealed.length === 0 && ready.length === 0 && (
            <p className="text-ink-soft text-sm col-span-3 py-6">
              No capsules yet — lock your first memory away above.
            </p>
          )}
        </Reveal>
      </div>
    </main>
  );
}
