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
  const [isDragOver, setIsDragOver] = useState(false);
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
      setError(e.message ?? "Upload failed — make sure the 'media' Storage bucket exists in Supabase.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`card p-10 mb-8 text-center border-2 border-dashed transition-all cursor-pointer shadow-editorial ${
        isDragOver ? "border-magenta bg-brand-gradient-soft scale-[1.01]" : "border-lavender-soft/70 hover:border-magenta hover:shadow-glass"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
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
      <div className="h-14 w-14 rounded-full bg-brand-gradient flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-md">
        🖼️
      </div>
      <p className="font-display text-xl font-bold text-ink mb-1">
        {loading ? "Uploading files to your vault…" : "Drop photos, videos, or voice notes here"}
      </p>
      <p className="text-ink-soft text-xs">Supports PNG, JPG, MP4, MP3, and WAV up to 50MB</p>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-blush border border-rose-soft/40 text-rose text-xs font-semibold max-w-md mx-auto">
          {error}
        </div>
      )}
    </div>
  );
}

