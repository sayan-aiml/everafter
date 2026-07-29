"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface WrappedProps {
  coupleCode: string;
  daysTogether: number;
  journalCount: number;
  milestoneCount: number;
  mediaCount: number;
  capsuleCount: number;
  bucketDone: number;
  bucketTotal: number;
}

export function WrappedPresentation({
  coupleCode,
  daysTogether,
  journalCount,
  milestoneCount,
  mediaCount,
  capsuleCount,
  bucketDone,
  bucketTotal,
}: WrappedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: `${new Date().getFullYear()} Wrapped`,
      subtitle: `Couple Space #${coupleCode.replace("LOVE-", "")}`,
      body: `You two have spent ${daysTogether.toLocaleString()} days writing your story side by side.`,
      icon: "❤️",
      highlight: `${daysTogether.toLocaleString()} Days`,
      bg: "from-rose-500 via-pink-600 to-purple-700 text-white",
    },
    {
      title: "Words & Reflections",
      subtitle: "Your Shared Journal",
      body: `Together you logged ${journalCount} journal reflections and preserved ${milestoneCount} timeline milestones.`,
      icon: "📓",
      highlight: `${journalCount} Entries`,
      bg: "from-purple-600 via-indigo-600 to-blue-700 text-white",
    },
    {
      title: "Memories & Vault",
      subtitle: "Sealed for Eternity",
      body: `You stored ${mediaCount} photos & videos in your vault and sealed ${capsuleCount} time capsules for the future.`,
      icon: "🔒",
      highlight: `${capsuleCount} Capsules`,
      bg: "from-amber-500 via-orange-600 to-rose-600 text-white",
    },
    {
      title: "Dreams Achieved",
      subtitle: "Bucket List Milestones",
      body: `Out of ${bucketTotal} shared dreams, you have officially completed ${bucketDone} together!`,
      icon: "🏆",
      highlight: `${bucketDone}/${bucketTotal} Done`,
      bg: "from-emerald-500 via-teal-600 to-cyan-700 text-white",
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="space-y-6">
      {/* Story Slide Container */}
      <div className={`rounded-3xl bg-gradient-to-br ${slide.bg} p-8 sm:p-12 shadow-floating relative overflow-hidden transition-all duration-500 min-h-[420px] flex flex-col justify-between`}>
        {/* Top Story Slide Progress Indicators */}
        <div className="flex gap-1.5 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                i <= currentSlide ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="text-center my-auto animate-fade-up">
          <span className="text-6xl mb-4 block">{slide.icon}</span>
          <p className="text-xs uppercase tracking-[0.25em] font-extrabold text-white/80 mb-1">{slide.subtitle}</p>
          <h2 className="font-display text-4xl sm:text-6xl font-bold mb-3">{slide.title}</h2>
          <div className="font-display text-5xl sm:text-7xl font-extrabold my-4 text-white drop-shadow-md">
            {slide.highlight}
          </div>
          <p className="text-base sm:text-lg text-white/90 max-w-md mx-auto leading-relaxed font-medium">
            {slide.body}
          </p>
        </div>

        {/* Story Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-white/20">
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide((p) => p - 1)}
            className="text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-xs font-bold text-white/80">
            {currentSlide + 1} of {slides.length}
          </span>
          <button
            disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide((p) => p + 1)}
            className="text-xs font-bold uppercase tracking-widest text-white hover:text-white disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <GlassCard tinted className="text-center">
          <p className="font-display text-3xl font-bold text-magenta">{daysTogether.toLocaleString()}</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mt-1">Days Together</p>
        </GlassCard>
        <GlassCard tinted className="text-center">
          <p className="font-display text-3xl font-bold text-lavender-deep">{journalCount}</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mt-1">Journal Entries</p>
        </GlassCard>
        <GlassCard tinted className="text-center">
          <p className="font-display text-3xl font-bold text-rose">{milestoneCount}</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mt-1">Milestones</p>
        </GlassCard>
      </div>
    </div>
  );
}
