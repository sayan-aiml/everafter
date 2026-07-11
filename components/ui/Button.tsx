import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200",
        variant === "primary" &&
          "bg-brand-gradient text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        variant === "outline" &&
          "border border-hairline text-ink hover:border-magenta hover:text-magenta bg-paper",
        variant === "ghost" && "text-ink-soft hover:text-magenta",
        className
      )}
      {...props}
    />
  );
}
