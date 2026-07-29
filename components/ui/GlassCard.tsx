import { clsx } from "clsx";
import type { ReactNode } from "react";

export function GlassCard({
  children,
  className,
  tinted = false,
  wax = false,
  hoverGlow = false,
}: {
  children: ReactNode;
  className?: string;
  tinted?: boolean;
  wax?: boolean;
  hoverGlow?: boolean;
}) {
  return (
    <div
      className={clsx(
        wax ? "card-wax" : tinted ? "card-tinted" : "card",
        hoverGlow && "hover:border-magenta-soft hover:shadow-glow cursor-pointer transition-all duration-300",
        "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

