"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/services/vault";
import { Button } from "@/components/ui/Button";

export function VaultUploader({ coupleId, userId }: { coupleId: string; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(supabase, { file, coupleId, userId });
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Upload failed — make sure the 'media' Storage bucket exists.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className="card p-10 mb-8 text-center border-2 border-dashed border-lavender-soft cursor-pointer hover:border-magenta transition-colors"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-3xl mb-2">🖼️</p>
      <p className="font-display text-lg mb-1">
        {loading ? "Uploading…" : "Drop photos or videos here"}
      </p>
      <p className="text-ink-soft text-sm">or click to choose files</p>
      {error && <p className="text-magenta text-sm mt-3">{error}</p>}
    </div>
  );
}
