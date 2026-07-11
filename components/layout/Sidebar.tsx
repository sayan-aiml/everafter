"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Home", emoji: "🏠" },
  { href: "/journal", label: "Journal", emoji: "📓" },
  { href: "/memories", label: "Timeline", emoji: "🗓️" },
  { href: "/capsules", label: "Capsules", emoji: "🔒" },
  { href: "/vault", label: "Vault", emoji: "⭐" },
  { href: "/playlist", label: "Playlist", emoji: "🎵" },
  { href: "/bucket-list", label: "Bucket list", emoji: "🧭" },
  { href: "/travel", label: "Map", emoji: "📍" },
  { href: "/wrapped", label: "Wrapped", emoji: "🎁" },
];

export function Sidebar({ coupleLabel }: { coupleLabel?: string }) {
  const pathname = usePathname();
  const supabase = createClient();

  return (
    <aside className="w-64 shrink-0 border-r border-hairline px-4 py-8 flex flex-col bg-paper">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-white font-display text-sm">
          E
        </div>
        <div>
          <p className="font-display text-base leading-tight">EverAfter</p>
          <p className="text-[10px] uppercase tracking-widest text-ink-soft">
            {coupleLabel ?? "you & partner"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              pathname?.startsWith(l.href)
                ? "bg-ink text-paper font-medium"
                : "text-ink-soft hover:text-ink hover:bg-lavender-soft/20"
            )}
          >
            <span className="text-base">{l.emoji}</span>
            {l.label}
          </Link>
        ))}
        <Link
          href="/settings"
          className={clsx(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors mt-2",
            pathname?.startsWith("/settings")
              ? "bg-ink text-paper font-medium"
              : "text-ink-soft hover:text-ink hover:bg-lavender-soft/20"
          )}
        >
          <span className="text-base">⚙️</span>
          Settings
        </Link>
      </nav>

      <div className="card-tinted p-4 mb-3 text-xs">
        <p className="font-semibold text-magenta-deep mb-1">Sealed with love</p>
        <p className="text-ink-soft leading-relaxed">Your space is private. Only two people can see this.</p>
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
        className="px-3 py-2 text-left text-sm text-ink-soft hover:text-magenta"
      >
        Sign out
      </button>
    </aside>
  );
}
