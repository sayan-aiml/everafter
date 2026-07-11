import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

<<<<<<< HEAD
export async function listPlaylistSongs(supabase: SupabaseClient) {
=======
export async function listPlaylistSongs(supabase: SupabaseClient<Database>) {
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as any[];
}

export async function addPlaylistSong(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
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
