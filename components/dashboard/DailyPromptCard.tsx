"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

const promptList = [
  "What made you smile about us today?",
  "What was your very first impression of me?",
  "What is one secret habit of mine you find adorable?",
  "Where were we the first time you realized we were meant to be?",
  "What is a song that instantly transports you back to our early days?",
  "If we could drop everything and travel anywhere tomorrow, where are we going?",
  "What is a goal or dream you want us to accomplish together this year?",
  "What is one small thing I did recently that made you feel deeply loved?",
  "What is your favorite memory of us in the rain or outdoors?",
  "What is a joke or moment between us that never fails to make you laugh?",
];

export function DailyPromptCard() {
  const [index, setIndex] = useState(0);

  function handleShuffle() {
    setIndex((prev) => (prev + 1) % promptList.length);
  }

  return (
    <GlassCard tinted className="relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow">✦ Today's Question</p>
        <button
          onClick={handleShuffle}
          className="text-xs text-ink-soft hover:text-magenta flex items-center gap-1 font-semibold transition-colors"
          title="Shuffle prompt"
        >
          <span>🎲</span> Shuffle
        </button>
      </div>

      <div className="my-2 min-h-[70px]">
        <p className="font-display text-2xl font-bold leading-tight text-ink">
          "{promptList[index]}"
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-hairline/60 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink-muted">Prompt #{index + 1} of {promptList.length}</span>
        <Link
          href="/journal"
          className="inline-flex items-center gap-1 text-xs text-magenta font-bold hover:text-magenta-deep transition-colors"
        >
          Answer in Journal →
        </Link>
      </div>
    </GlassCard>
  );
}
