import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type MediaType = "photo" | "video" | "audio" | "document";

export async function listMedia(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as any[];
}

// Uploads a file into the private `media` Storage bucket under a
// couple-scoped path, then records the metadata row. Storage RLS should
// mirror table RLS: policies check that the path's first segment equals
// current_couple_id() (see supabase/schema.sql comment block).
export async function uploadMedia(
  supabase: SupabaseClient<Database>,
  {
    file,
    coupleId,
    userId,
    caption,
  }: { file: File; coupleId: string; userId: string; caption?: string }
) {
  const mediaType: MediaType = file.type.startsWith("image/")
    ? "photo"
    : file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("audio/")
    ? "audio"
    : "document";

  const ext = file.name.split(".").pop();
  const path = `${coupleId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("media")
    .insert({
      couple_id: coupleId,
      uploaded_by: userId,
      storage_path: path,
      media_type: mediaType,
      mime_type: file.type,
      size_bytes: file.size,
      caption: caption ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMediaUrl(supabase: SupabaseClient<Database>, path: string) {
  // Private bucket — use a signed URL rather than a public one.
  const { data, error } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}
