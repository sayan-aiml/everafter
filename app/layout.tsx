import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "EverAfter — A Private Home for Your Relationship",
  description:
    "EverAfter is a private, ad-free digital sanctuary for two people to preserve their relationship forever — journal, timeline memories, time capsules, music, travel map, and relationship wrapped.",
  keywords: ["couple journal", "relationship app", "private memories", "time capsule for couples", "relationship wrapped"],
  authors: [{ name: "EverAfter" }],
  openGraph: {
    title: "EverAfter — A Private Home for Your Relationship",
    description: "The operating system for relationships. Private by design, sealed with love.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased selection:bg-magenta-soft/30 selection:text-magenta-deep min-h-screen">
        {children}
        {/* anime.js — used for staggered entrance animations via components/ui/Reveal.tsx */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}

