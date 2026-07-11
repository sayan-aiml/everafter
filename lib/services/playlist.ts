import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function listPlaylistSongs(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as any[];
}

export async function addPlaylistSong(
  supabase: SupabaseClient<Database>,
  song: {
    couple_id: string;
    added_by: string;
    title: string;
    artist?: string;
    spotify_url?: string;
    youtube_url?: string;
    memory_note?: string;
  }
) {
  const { data, error } = await supabase.from("playlist_songs").insert(song).select().single();
  if (error) throw error;
  return data;
}
