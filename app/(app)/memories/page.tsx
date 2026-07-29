import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listMemories } from "@/lib/services/memories";
import { MemoryForm } from "@/components/memories/MemoryForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

const iconFor: Record<string, string> = {
  first_text: "💬", first_call: "📞", first_date: "🌙", first_meet: "✨",
  birthday: "🎂", trip: "✈️", anniversary: "💫", milestone: "⭐", other: "🌟",
};

export default async function MemoriesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const memories = await listMemories(supabase);

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Memory Timeline</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">Our story, in order.</h1>
        <p className="text-ink-soft text-sm mt-2">Every milestone, first date, trip, and turning point — the sequence that makes us, us.</p>
      </div>

      <MemoryForm coupleId={couple.id} userId={user.id} />

      <Reveal className="relative pl-10 sm:pl-12 space-y-8">
        {/* Glowing vertical connector line */}
        <div className="absolute left-[19px] sm:left-[23px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-magenta via-lavender to-hairline rounded-full" />

        {memories.map((m) => (
          <div key={m.id} className="relative group">
            {/* Timeline node badge */}
            <span className="absolute -left-10 sm:-left-12 top-0 h-10 w-10 rounded-full bg-paper-pure border-2 border-magenta/40 shadow-sm flex items-center justify-center text-lg group-hover:scale-110 group-hover:border-magenta transition-all">
              {iconFor[m.type] ?? "⭐"}
            </span>

            <GlassCard hoverGlow className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="eyebrow text-magenta font-bold">{format(new Date(m.memory_date), "MMMM d, yyyy").toUpperCase()}</p>
                <span className="text-[10px] uppercase font-bold text-ink-muted bg-paper-pure px-2.5 py-0.5 rounded-full border border-hairline">
                  {m.type.replace("_", " ")}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink mb-1">{m.title}</h3>
              {m.description && (
                <p className="text-ink-soft text-sm leading-relaxed mt-2 bg-paper-pure/70 p-3 rounded-xl border border-hairline/60">
                  {m.description}
                </p>
              )}
            </GlassCard>
          </div>
        ))}

        {memories.length === 0 && (
          <div className="card p-10 text-center text-ink-soft text-sm">
            No memories added yet — add your first milestone above to start your timeline!
          </div>
        )}
      </Reveal>
    </main>
  );
}

