import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-magenta/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none",
        size === "sm" && "px-3.5 py-1.5 text-xs gap-1.5",
        size === "md" && "px-5 py-2.5 text-sm gap-2",
        size === "lg" && "px-7 py-3.5 text-base gap-2.5",
        variant === "primary" &&
          "bg-brand-gradient text-white shadow-md hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        variant === "secondary" &&
          "bg-lavender-soft/40 text-lavender-deep hover:bg-lavender-soft/70 active:scale-[0.98]",
        variant === "outline" &&
          "border border-hairline text-ink hover:border-magenta hover:text-magenta bg-paper-pure/80 hover:shadow-sm active:scale-[0.98]",
        variant === "ghost" && "text-ink-soft hover:text-magenta hover:bg-lavender-soft/20",
        variant === "gold" &&
          "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-glow-gold hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

