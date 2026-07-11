import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { listTravelPins } from "@/lib/services/travel";
import { TravelPinForm } from "@/components/travel/TravelPinForm";
import { GlassCard } from "@/components/ui/GlassCard";

const statusMeta: Record<string, { label: string; emoji: string }> = {
  visited: { label: "Visited", emoji: "✅" },
  want_to_visit: { label: "Want to Visit", emoji: "💭" },
  next_trip: { label: "Next Trip", emoji: "🧳" },
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
    <main className="px-10 py-10 max-w-4xl">
      <h1 className="font-display text-4xl mb-2">Travel Map</h1>
      <p className="text-ink-soft mb-6">
        Every place you've been, and everywhere you're dreaming of going next.
      </p>

      <TravelPinForm coupleId={couple.id} userId={user.id} />

      <div className="space-y-8">
        {groups.map((g) => (
          <div key={g.status}>
            <p className="text-ink-soft text-xs uppercase tracking-widest font-semibold mb-3">
              {statusMeta[g.status].emoji} {statusMeta[g.status].label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {g.pins.map((pin) => (
                <GlassCard key={pin.id} className="text-center">
                  <p className="text-2xl mb-1">📍</p>
                  <p className="font-display text-lg">{pin.place_name}</p>
                </GlassCard>
              ))}
              {g.pins.length === 0 && <p className="text-ink-soft text-sm">Nothing here yet.</p>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-ink-soft text-xs mt-10">
        Note: this is a pin-list view for now. Swap in Mapbox/Leaflet + a geocoding API for the
        full interactive world map from the original brief — see docs/ROADMAP.md.
      </p>
    </main>
  );
}
