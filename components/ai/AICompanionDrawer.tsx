"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const quickPrompts = [
  "💡 Give us 3 unique date night ideas for this weekend",
  "💌 Draft a sweet letter for a time capsule",
  "❓ Give me a deep daily question to ask my partner",
  "✈️ Suggest a romantic travel destination for our next trip",
];

export function AICompanionDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hello! I am your private EverAfter Relationship Companion. I can help you plan date nights, draft romantic letters, or suggest daily journal questions. What's on your mind today?",
    },
  ]);
  const [thinking, setThinking] = useState(false);

  function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: "user" as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setThinking(true);

    setTimeout(() => {
      let reply = "That sounds like a wonderful moment to create together!";
      const q = query.toLowerCase();

      if (q.includes("date night") || q.includes("date")) {
        reply = "Here are 3 romantic date night ideas tailored for you two:\n\n1. 🍝 **Starlight Backyard Picnic**: Set up cozy blankets, light fairy lights, make homemade pasta, and play your shared playlist under the stars.\n\n2. 🎨 **Blindfold Painting Challenge**: Paint portraits of each other without looking at your canvas until finished!\n\n3. 🍿 **Vintage Movie & Fondue Night**: Pick a classic movie from the year you met and prepare warm chocolate fondue with fresh strawberries.";
      } else if (q.includes("letter") || q.includes("time capsule") || q.includes("anniversary")) {
        reply = "Here is a romantic letter draft for your time capsule:\n\n\"My love,\nIf you are reading this years from now, I hope you remember today as clearly as I do. We have grown so much together, through every quiet morning and late-night laugh. Thank you for being my anchor, my partner, and my favorite story. Here is to all the chapters we have yet to write.\n\nForever yours.\"";
      } else if (q.includes("question") || q.includes("prompt")) {
        reply = "Here is a meaningful question to ask your partner today:\n\n✨ *\"What is a small, quiet moment between us from the past year that you still think about when you need a smile?\"*";
      } else if (q.includes("travel") || q.includes("trip")) {
        reply = "Romantic trip idea: **Santorini & Amalfi Coast Getaway** 🌅\nExplore cliffside pastel villages, take a private sunset sailboat tour, and sample authentic coastal cuisine together!";
      }

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setThinking(false);
    }, 1000);
  }

  return (
    <>
      {/* Floating AI Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 bg-brand-gradient text-white px-4 py-3 rounded-full shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-medium text-xs md:text-sm"
      >
        <span className="text-base animate-pulse">✨</span>
        <span className="hidden sm:inline">AI Companion</span>
      </button>

      {/* Drawer Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-md bg-paper-pure min-h-full flex flex-col justify-between shadow-floating border-l border-hairline z-10 animate-fade-up">
            {/* Top Bar */}
            <div className="p-4 sm:p-6 border-b border-hairline flex items-center justify-between bg-paper-pure/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-white text-base shadow-sm">
                  ✨
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">AI Relationship Companion</h3>
                  <p className="text-[10px] uppercase font-bold text-magenta tracking-widest">Private & Only For You Two</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-lavender-soft/20"
              >
                ✕
              </button>
            </div>

            {/* Chat History Container */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-sm">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-ink text-paper-pure rounded-tr-none shadow-sm"
                        : "bg-brand-gradient-soft border border-lavender-soft/60 text-ink rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="bg-lavender-soft/30 border border-lavender-soft/50 rounded-2xl p-3 text-xs text-ink-soft animate-pulse flex items-center gap-2">
                    <span className="animate-spin">✨</span> Crafting a response...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts & Input Area */}
            <div className="p-4 sm:p-6 border-t border-hairline bg-paper-pure">
              <div className="flex gap-2 overflow-x-auto pb-3 mb-3 no-scrollbar">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp)}
                    className="text-[11px] font-medium whitespace-nowrap bg-paper border border-hairline px-3 py-1.5 rounded-full text-ink-soft hover:text-magenta hover:border-magenta transition-colors shrink-0"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for date ideas, letter drafts..."
                  className="input-field py-2.5 text-xs sm:text-sm"
                />
                <Button type="submit" size="sm" disabled={thinking}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
