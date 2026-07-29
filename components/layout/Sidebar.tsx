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
  { href: "/bucket-list", label: "Bucket List", emoji: "🧭" },
  { href: "/travel", label: "Travel Map", emoji: "📍" },
  { href: "/wrapped", label: "Wrapped", emoji: "🎁" },
];

export function Sidebar({ coupleLabel }: { coupleLabel?: string }) {
  const pathname = usePathname();
  const supabase = createClient();

  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r border-hairline/80 px-4 py-7 flex-col bg-paper-pure/90 backdrop-blur-md justify-between sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Brand & Couple Badge */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 group">
          <div className="h-10 w-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-display text-base font-bold shadow-sm group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-none text-ink">EverAfter</p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-magenta">
              {coupleLabel ? coupleLabel.replace("LOVE-", "Space #") : "You & Partner"}
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                pathname?.startsWith(l.href)
                  ? "bg-ink text-paper-pure font-semibold shadow-xs"
                  : "text-ink-soft hover:text-ink hover:bg-lavender-soft/20"
              )}
            >
              <span className="text-base">{l.emoji}</span>
              <span className="flex-1">{l.label}</span>
              {l.href === "/capsules" && (
                <span className="h-2 w-2 rounded-full bg-magenta animate-pulse" />
              )}
            </Link>
          ))}

          <div className="pt-2 my-2 border-t border-hairline/60" />

          <Link
            href="/settings"
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
              pathname?.startsWith("/settings")
                ? "bg-ink text-paper-pure font-semibold shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-lavender-soft/20"
            )}
          >
            <span className="text-base">⚙️</span>
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Footer Info Card & Logout */}
      <div className="pt-4">
        <div className="rounded-2xl bg-brand-gradient-soft border border-lavender-soft/50 p-4 mb-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-magenta mb-1">
            <span className="h-2 w-2 rounded-full bg-magenta animate-ping" />
            <span>Private Sanctuary</span>
          </div>
          <p className="text-ink-soft leading-relaxed text-[11px]">
            End-to-end isolated for the two of you. Sealed with love.
          </p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="w-full px-3 py-2 text-left text-xs font-semibold text-rose hover:bg-rose-blush rounded-xl transition-colors flex items-center gap-2"
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
}

