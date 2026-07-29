"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

const features = [
  {
    id: "timeline",
    icon: "🗓️",
    title: "Living Timeline",
    tagline: "Every milestone, in sequence",
    body: "First texts, late-night calls, first dates, anniversaries, and spontaneous trips — beautifully ordered into your relationship timeline.",
  },
  {
    id: "capsules",
    icon: "🔒",
    title: "Time Capsules",
    tagline: "Letters sealed for tomorrow",
    body: "Lock away letters, photos, or voice notes until a specific future date — an anniversary, a birthday, or 5 years from today.",
  },
  {
    id: "journal",
    icon: "📓",
    title: "Couple Journal",
    tagline: "Daily prompts for two",
    body: "Answer deep or playful daily prompts together, or write private diary notes. A shared space that grows with you.",
  },
  {
    id: "playlist",
    icon: "🎵",
    title: "Shared Soundtrack",
    tagline: "Songs that hold your memories",
    body: "Catalog every song that defined a moment — with personal stories about why that melody will always belong to you two.",
  },
  {
    id: "travel",
    icon: "📍",
    title: "Travel Map",
    tagline: "Your world together",
    body: "Pin places you've explored, upcoming trips, and dream destinations on your joint travel map.",
  },
  {
    id: "wrapped",
    icon: "🎁",
    title: "Relationship Wrapped",
    tagline: "Annual story recaps",
    body: "Experience a Spotify-Wrapped style annual recap: total days shared, photos logged, favorite songs, and milestone stats.",
  },
];

const testimonials = [
  {
    quote: "It feels like having our own quiet corner of the internet. No feeds, no ads, just us.",
    author: "Elena & Marcus",
    years: "Together 4 years",
  },
  {
    quote: "Opening our first time capsule on our 3rd anniversary brought happy tears. Unforgettable.",
    author: "Sophia & Liam",
    years: "Together 3 years",
  },
  {
    quote: "The daily prompts have sparked some of our deepest midnight conversations.",
    author: "Maya & David",
    years: "Together 6 years",
  },
];

const faqs = [
  {
    q: "Is EverAfter completely private?",
    a: "Yes. Every couple space is strictly isolated using database-level Row-Level Security (RLS). There are no public profiles, no search indexes, and zero ads.",
  },
  {
    q: "How do I connect with my partner?",
    a: "When you sign up, you'll receive a unique 1-click invite code to send to your partner. Entering that code pairs your accounts instantly.",
  },
  {
    q: "Can we export our memories anytime?",
    a: "Absolutely. You retain 100% ownership of your data and can export all journal entries, photos, and milestones in standard JSON format at any time.",
  },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative min-h-screen bg-paper overflow-hidden text-ink">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-gradient-soft rounded-full blur-3xl opacity-60 animate-pulse-glow" />
        <div className="absolute top-80 right-10 w-72 h-72 bg-magenta-glow rounded-full blur-2xl opacity-40 animate-float" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-lavender-mist rounded-full blur-3xl opacity-50 animate-float [animation-delay:2s]" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-paper-pure/70 border-b border-hairline/60 transition-all">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              E
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-ink">EverAfter</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
            <a href="#features" className="hover:text-magenta transition-colors">Features</a>
            <a href="#privacy" className="hover:text-magenta transition-colors">Privacy</a>
            <a href="#stories" className="hover:text-magenta transition-colors">Stories</a>
            <a href="#faq" className="hover:text-magenta transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm">Create Your Space</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-lavender-soft/40 px-4 py-1.5 border border-lavender-soft/60 mb-6 animate-fade-up">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-magenta">Private Digital Home for Two</span>
          <span className="text-xs text-lavender-deep">✨</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight mb-6 animate-fade-up">
          Your relationship deserves
          <br />
          <span className="brand-text">more than a photo gallery.</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-ink-soft leading-relaxed font-normal mb-10 animate-fade-up">
          A dedicated sanctuary for two people to write daily journals, build a milestone timeline, seal future time capsules, and curate your shared soundtrack.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-up">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto shadow-glow">
              Start Your Private Space — Free
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Features ↓
            </Button>
          </a>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-16 mx-auto max-w-4xl rounded-3xl p-3 bg-paper-pure/80 border border-hairline shadow-floating backdrop-blur-xl">
          <div className="rounded-2xl overflow-hidden bg-paper border border-hairline/80 p-6 sm:p-8 text-left">
            {/* Top Bar Mockup */}
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-magenta/20 border-2 border-white flex items-center justify-center text-xs font-bold text-magenta">M</div>
                  <div className="h-8 w-8 rounded-full bg-lavender/30 border-2 border-white flex items-center justify-center text-xs font-bold text-lavender-deep">E</div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-magenta">EverAfter · Day 1,248</p>
                  <p className="font-display text-base font-bold text-ink">Maya & Ethan’s Space</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-rose-blush text-rose font-medium border border-rose-soft/30">
                  <span className="h-2 w-2 rounded-full bg-rose animate-ping" />
                  Connected
                </span>
              </div>
            </div>

            {/* Interactive Preview Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {features.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === idx
                      ? "bg-ink text-paper-pure shadow-sm"
                      : "bg-paper-pure border border-hairline text-ink-soft hover:border-lavender-soft"
                  }`}
                >
                  <span className="mr-1.5">{f.icon}</span>
                  {f.title}
                </button>
              ))}
            </div>

            {/* Active Preview Display */}
            <div className="rounded-xl bg-paper-pure border border-hairline/80 p-6 shadow-editorial">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{features[activeTab].icon}</span>
                <div>
                  <h4 className="font-display text-xl font-bold">{features[activeTab].title}</h4>
                  <p className="text-xs text-magenta font-semibold uppercase tracking-wider">{features[activeTab].tagline}</p>
                </div>
              </div>
              <p className="text-ink-soft text-sm leading-relaxed mt-2">{features[activeTab].body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24 border-t border-hairline/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="eyebrow mb-2">Crafted for Intimacy</p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight">Everything your story requires.</h2>
          <p className="text-ink-soft text-base mt-3">Designed from the ground up for two people — no public social features, ever.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <GlassCard key={f.id} hoverGlow className="flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-brand-gradient-soft border border-lavender-soft/40 flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display text-2xl text-ink mb-1">{f.title}</h3>
                <p className="eyebrow mb-3 text-[10px] text-magenta">{f.tagline}</p>
                <p className="text-ink-soft text-sm leading-relaxed">{f.body}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-dark-glass text-paper-pure p-10 sm:p-14 border border-hairline/20 shadow-floating relative overflow-hidden">
          <div className="max-w-2xl">
            <p className="eyebrow text-magenta-soft mb-3">Privacy First</p>
            <h2 className="font-display text-4xl sm:text-5xl mb-4 text-white">Your love story is strictly your business.</h2>
            <p className="text-ink-muted text-base leading-relaxed mb-8">
              We engineered EverAfter with Postgres Row-Level Security (RLS). Only your partner and you have access to your space. No algorithmic feeds, no data sales, no public access.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-white/10 pt-6">
              <div>
                <p className="font-bold text-white text-lg mb-1">🔒 100% Isolated</p>
                <p className="text-xs text-ink-muted">Server-enforced couple boundaries</p>
              </div>
              <div>
                <p className="font-bold text-white text-lg mb-1">🚫 Zero Ads</p>
                <p className="text-xs text-ink-muted">Pure private sanctuary experience</p>
              </div>
              <div>
                <p className="font-bold text-white text-lg mb-1">📦 Data Export</p>
                <p className="text-xs text-ink-muted">Download your full history anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="mx-auto max-w-6xl px-6 py-24 border-t border-hairline/60">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="eyebrow mb-2">Love Stories</p>
          <h2 className="font-display text-4xl tracking-tight">Cherished by couples worldwide.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <GlassCard key={idx} tinted className="flex flex-col justify-between">
              <p className="font-display italic text-lg text-ink mb-6">"{t.quote}"</p>
              <div>
                <p className="font-bold text-sm text-magenta">{t.author}</p>
                <p className="text-xs text-ink-soft">{t.years}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20 border-t border-hairline/60">
        <div className="text-center mb-12">
          <p className="eyebrow mb-2">Got Questions?</p>
          <h2 className="font-display text-4xl">Frequently Asked</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <GlassCard key={i}>
              <h4 className="font-display text-lg font-semibold text-ink mb-2">{f.q}</h4>
              <p className="text-ink-soft text-sm leading-relaxed">{f.a}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <GlassCard tinted className="p-12 sm:p-16">
          <h2 className="font-display text-4xl sm:text-5xl mb-4">Start preserving your story today.</h2>
          <p className="text-ink-soft text-lg max-w-lg mx-auto mb-8">
            Create your private couple space in less than 60 seconds.
          </p>
          <Link href="/login">
            <Button size="lg" className="shadow-glow">
              Build Your Space Together ❤️
            </Button>
          </Link>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline px-6 py-10 text-center text-ink-soft text-xs">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-brand-gradient text-white font-display text-xs font-bold flex items-center justify-center">E</div>
            <span className="font-display font-semibold text-ink">EverAfter</span>
            <span>— sealed with love.</span>
          </div>
          <p>© {new Date().getFullYear()} EverAfter Inc. Private by design. No ads, no public profiles.</p>
        </div>
      </footer>
    </div>
  );
}

