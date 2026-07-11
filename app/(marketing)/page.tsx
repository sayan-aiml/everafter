import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

const sections = [
  {
    title: "Memories",
    body: "A living timeline of every milestone — first texts, first dates, trips, and everything after.",
  },
  {
    title: "Time Capsules",
    body: "Lock a letter, photo, or voice note away until the day it's meant to be opened.",
  },
  {
    title: "Journal",
    body: "Daily prompts and free-form entries, side by side, searchable, always private to the two of you.",
  },
  {
    title: "Relationship Wrapped",
    body: "A beautiful, animated recap of your year together — days shared, photos, songs, and more.",
  },
  {
    title: "AI Companion",
    body: "An assistant that only knows your relationship. Ask it to find a memory or write a letter.",
  },
  {
    title: "Privacy",
    body: "No public profiles. No feed. No strangers. Just the two of you — export or delete anytime.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* floating ambient particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] h-2 w-2 rounded-full bg-lavender/40 animate-float" />
        <div className="absolute top-40 right-[15%] h-1.5 w-1.5 rounded-full bg-magenta/50 animate-float [animation-delay:1s]" />
        <div className="absolute bottom-32 left-[25%] h-1 w-1 rounded-full bg-lavender-soft animate-float [animation-delay:2s]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-32 pb-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-lavender-deep">
          The operating system for relationships
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">
          Your relationship deserves
          <br />
          <span className="brand-text">more than a gallery.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-ink-soft text-lg">
          A private digital home for two people — journal, memories, time capsules, and a
          companion that knows only your story.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/login">
            <Button>Create Your Space</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline">See how it works</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {sections.map((s) => (
            <GlassCard key={s.title} className="hover:shadow-glow transition-shadow duration-500">
              <h3 className="font-display text-2xl text-magenta-soft mb-2">{s.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{s.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <footer className="border-t border-lavender-soft/30 px-6 py-10 text-center text-ink-soft text-sm">
        EverAfter — private by design. No ads, no public profiles, no feed. Ever.
      </footer>
    </main>
  );
}
