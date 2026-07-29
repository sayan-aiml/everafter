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
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<TravelStatus>("want_to_visit");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!place.trim()) return;
    setLoading(true);
    try {
      await createTravelPin(supabase, {
        couple_id: coupleId,
        created_by: userId,
        place_name: place,
        latitude: 0,
        longitude: 0,
        status,
        notes: notes || undefined,
      });
      setPlace("");
      setNotes("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-3.5 shadow-editorial hover:shadow-glass transition-all">
      <div className="flex items-center justify-between">
        <p className="eyebrow">📍 Drop a Location Pin</p>
        <span className="text-xl">✈️</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink-soft mb-1">Location / Destination Name</label>
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="e.g. Paris, France or Amalfi Coast"
            required
            className="input-field font-display text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Travel Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TravelStatus)}
            className="input-field font-medium"
          >
            <option value="next_trip">🧳 Next Trip</option>
            <option value="want_to_visit">💭 Want to Visit</option>
            <option value="visited">✅ Visited</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1">Notes / Memories (Optional)</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Best coffee shop near the Eiffel Tower!"
          className="input-field"
        />
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" loading={loading} size="md">
          Drop Pin on Map 📍
        </Button>
      </div>
    </form>
  );
}

