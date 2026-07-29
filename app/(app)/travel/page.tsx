import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listTravelPins } from "@/lib/services/travel";
import { TravelPinForm } from "@/components/travel/TravelPinForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

const statusMeta: Record<string, { label: string; emoji: string; color: string }> = {
  next_trip: { label: "Next Trip", emoji: "🧳", color: "text-magenta bg-magenta-glow/40 border-magenta-soft/40" },
  want_to_visit: { label: "Want to Visit", emoji: "💭", color: "text-lavender-deep bg-lavender-soft/40 border-lavender-soft" },
  visited: { label: "Visited Places", emoji: "✅", color: "text-green-700 bg-green-50 border-green-300" },
};

export default async function TravelPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const couple = await getMyCouple(supabase);
  if (!couple || !user) return null;

  const pins = await listTravelPins(supabase);
  const groups = ["next_trip", "want_to_visit", "visited"].map((status) => ({
    status,
    pins: pins.filter((p) => p.status === status),
  }));

  return (
    <main className="px-6 sm:px-10 py-8 sm:py-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="eyebrow mb-2">Travel Map</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">Your world together.</h1>
        <p className="text-ink-soft text-sm mt-2">Every place you've explored, and every dream destination waiting for you.</p>
      </div>

      <TravelPinForm coupleId={couple.id} userId={user.id} />

      <Reveal className="space-y-10">
        {groups.map((g) => {
          const meta = statusMeta[g.status];
          return (
            <div key={g.status}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{meta.emoji}</span>
                <p className="eyebrow font-bold text-ink">{meta.label}</p>
                <span className="text-xs text-ink-muted font-semibold">({g.pins.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {g.pins.map((pin) => (
                  <GlassCard key={pin.id} hoverGlow className="flex flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">📍</span>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-ink mb-1">{pin.place_name}</h3>
                      {pin.notes && (
                        <p className="text-xs text-ink-soft italic mt-2 bg-paper-pure/80 p-2.5 rounded-xl border border-hairline/60">
                          "{pin.notes}"
                        </p>
                      )}
                    </div>
                  </GlassCard>
                ))}

                {g.pins.length === 0 && (
                  <div className="col-span-full card p-6 text-center text-ink-soft text-xs">
                    No pins added under {meta.label} yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Reveal>
    </main>
  );
}

