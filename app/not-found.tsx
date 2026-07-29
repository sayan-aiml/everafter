import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12 bg-paper text-ink overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gradient-soft rounded-full blur-3xl opacity-50 animate-pulse-glow" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-10 shadow-floating">
          <div className="h-16 w-16 rounded-full bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-4 shadow-md">
            404
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-ink-soft text-sm mb-6 leading-relaxed">
            The page you're looking for might have been moved, renamed, or sealed in a capsule.
          </p>

          <Link href="/dashboard">
            <Button size="lg" className="w-full font-bold">
              Return to Dashboard ✨
            </Button>
          </Link>
        </GlassCard>
      </div>
    </main>
  );
}
