"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";

const mobilePrimaryLinks = [
  { href: "/dashboard", label: "Home", emoji: "🏠" },
  { href: "/journal", label: "Journal", emoji: "📓" },
  { href: "/memories", label: "Timeline", emoji: "🗓️" },
  { href: "/capsules", label: "Capsules", emoji: "🔒" },
];

const allLinks = [
  { href: "/dashboard", label: "Home", emoji: "🏠" },
  { href: "/journal", label: "Journal", emoji: "📓" },
  { href: "/memories", label: "Timeline", emoji: "🗓️" },
  { href: "/capsules", label: "Time Capsules", emoji: "🔒" },
  { href: "/vault", label: "Memory Vault", emoji: "⭐" },
  { href: "/playlist", label: "Shared Playlist", emoji: "🎵" },
  { href: "/bucket-list", label: "Bucket List", emoji: "🧭" },
  { href: "/travel", label: "Travel Map", emoji: "📍" },
  { href: "/wrapped", label: "Wrapped", emoji: "🎁" },
  { href: "/settings", label: "Settings", emoji: "⚙️" },
];

export function MobileNav({ coupleLabel }: { coupleLabel?: string }) {
  const pathname = usePathname();
  const supabase = createClient();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      {/* Top Header Bar for Mobile */}
      <header className="md:hidden sticky top-0 z-40 bg-paper-pure/90 backdrop-blur-md border-b border-hairline px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-brand-gradient flex items-center justify-center text-white font-display text-xs font-bold">
            E
          </div>
          <span className="font-display font-bold text-base text-ink">EverAfter</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-magenta bg-lavender-soft/30 px-2.5 py-1 rounded-full border border-lavender-soft/50">
            {coupleLabel ? coupleLabel.replace("LOVE-", "") : "Us"}
          </span>
          <button
            onClick={() => setOpenDrawer(true)}
            className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-lavender-soft/20 focus:outline-none"
            aria-label="Open Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Modal */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
            onClick={() => setOpenDrawer(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-paper-pure min-h-full p-6 flex flex-col justify-between shadow-floating border-r border-hairline z-10 animate-fade-up">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-hairline">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-white font-display text-sm font-bold">
                    E
                  </div>
                  <div>
                    <p className="font-display font-bold text-base">EverAfter</p>
                    <p className="text-[10px] uppercase font-semibold text-magenta">{coupleLabel ?? "Private Space"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenDrawer(false)}
                  className="p-1 rounded-lg text-ink-soft hover:text-ink"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-1">
                {allLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpenDrawer(false)}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors",
                      pathname?.startsWith(l.href)
                        ? "bg-ink text-paper-pure font-semibold shadow-xs"
                        : "text-ink-soft hover:text-ink hover:bg-lavender-soft/20"
                    )}
                  >
                    <span className="text-base">{l.emoji}</span>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-hairline">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
                className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-rose hover:bg-rose-blush transition-colors flex items-center gap-2"
              >
                <span>🚪</span> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Navigation Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper-pure/95 backdrop-blur-xl border-t border-hairline px-4 py-2 flex items-center justify-around shadow-floating">
        {mobilePrimaryLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={clsx(
              "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all text-xs font-medium",
              pathname?.startsWith(l.href)
                ? "text-magenta font-bold scale-105"
                : "text-ink-soft hover:text-ink"
            )}
          >
            <span className="text-lg">{l.emoji}</span>
            <span>{l.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setOpenDrawer(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-xs font-medium text-ink-soft hover:text-ink"
        >
          <span className="text-lg">✨</span>
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
