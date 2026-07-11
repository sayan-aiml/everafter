import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listMemories } from "@/lib/services/memories";
import { MemoryForm } from "@/components/memories/MemoryForm";
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
    <main className="px-10 py-10 max-w-3xl">
      <p className="eyebrow mb-2">Memory timeline</p>
      <h1 className="font-display text-5xl mb-2">Our story, in order.</h1>
      <p className="text-ink-soft mb-8">Every milestone, first, and turning point — the sequence that makes us, us.</p>

      <MemoryForm coupleId={couple.id} userId={user.id} />

      <Reveal className="relative pl-8 space-y-6">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-hairline" />
        {memories.map((m) => (
          <div key={m.id} className="relative">
            <span className="absolute -left-8 top-0 h-8 w-8 rounded-full bg-lavender-soft/40 border border-hairline flex items-center justify-center text-sm">
              {iconFor[m.type] ?? "⭐"}
            </span>
            <div className="card p-5">
              <p className="eyebrow mb-1">{format(new Date(m.memory_date), "d MMMM yyyy").toUpperCase()}</p>
              <p className="font-display text-2xl">{m.title}</p>
              {m.description && <p className="text-ink-soft text-sm mt-1">{m.description}</p>}
            </div>
          </div>
        ))}
        {memories.length === 0 && (
          <p className="text-ink-soft text-sm py-10">No memories yet — add your first milestone above.</p>
        )}
      </Reveal>
    </main>
  );
}
