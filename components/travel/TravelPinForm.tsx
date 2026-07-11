"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createTravelPin, type TravelStatus } from "@/lib/services/travel";
import { Button } from "@/components/ui/Button";

export function TravelPinForm({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState<TravelStatus>("want_to_visit");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!place.trim()) return;
    setLoading(true);
    try {
      // Geocoding is out of scope for the starter — lat/lng default to 0,0.
      // Swap in a geocoding API (e.g. Mapbox Geocoding) before shipping the
      // real interactive map; the pin list UI already works either way.
      await createTravelPin(supabase, {
        couple_id: coupleId,
        created_by: userId,
        place_name: place,
        latitude: 0,
        longitude: 0,
        status,
      });
      setPlace("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-ink-soft text-xs font-medium">Place</label>
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Santorini, Greece"
          className="w-full rounded-2xl bg-paper border border-hairline px-4 py-2.5 mt-1 outline-none focus:border-magenta"
        />
      </div>
      <div>
        <label className="text-ink-soft text-xs font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TravelStatus)}
          className="block rounded-2xl bg-paper border border-hairline px-4 py-2.5 mt-1 outline-none focus:border-magenta"
        >
          <option value="want_to_visit">💭 Want to Visit</option>
          <option value="next_trip">🧳 Next Trip</option>
          <option value="visited">✅ Visited</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Pinning…" : "Add Pin"}
      </Button>
    </form>
  );
}
