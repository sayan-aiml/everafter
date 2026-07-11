import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "EverAfter — A private home for your relationship",
  description:
    "EverAfter is a private, ad-free space for two people to preserve their relationship forever — journal, memories, time capsules, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* anime.js — used for staggered entrance animations via components/ui/Reveal.tsx */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
