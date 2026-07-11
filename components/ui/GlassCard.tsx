import { clsx } from "clsx";
import type { ReactNode } from "react";

// Kept the filename `GlassCard` for import-compatibility across the app,
// but the visual language is now flat/editorial (hairline border, no blur)
// rather than glassmorphism — matches the Swiss/editorial direction.
export function GlassCard({
  children,
  className,
  tinted = false,
}: {
  children: ReactNode;
  className?: string;
  tinted?: boolean;
}) {
  return (
    <div className={clsx(tinted ? "card-tinted" : "card", "p-6", className)}>
      {children}
    </div>
  );
}
