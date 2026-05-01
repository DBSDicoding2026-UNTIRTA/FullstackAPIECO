"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavIconVariant = "sidebar" | "bottom";

interface NavIconProps {
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  label: string;
  variant?: NavIconVariant;
  className?: string;
  showIndicator?: boolean;
}

export function NavIcon({
  icon: Icon,
  active = false,
  onClick,
  label,
  variant = "sidebar",
  className,
  showIndicator = true,
}: NavIconProps) {
  const isBottom = variant === "bottom";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "group relative flex items-center justify-center",
        "outline-none transition-all duration-300 ease-out",
        "focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-0",
        isBottom
          ? ["h-14 w-14 rounded-2xl", "active:scale-95"]
          : ["h-12 w-12 rounded-2xl", "hover:scale-105 active:scale-95"],
        className
      )}
    >
      {!isBottom && active && showIndicator && (
        <span className="absolute -left-2 h-7 w-1 rounded-full bg-linear-to-b from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
      )}

      <span
        className={cn(
          "absolute inset-0 rounded-[inherit] transition-all duration-300",
          "border backdrop-blur-xl",
          active
            ? [
                "border-emerald-200 bg-linear-to-br from-emerald-100 to-lime-50 shadow-[0_8px_24px_rgba(16,185,129,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]",
              ]
            : [
                "border-emerald-100 bg-white/80 shadow-[0_6px_18px_rgba(16,185,129,0.08)]",
                "group-hover:bg-emerald-50",
                "group-hover:border-emerald-200",
              ]
        )}
      />

      <span
        className={cn(
          "absolute inset-[1px] rounded-[inherit] transition-opacity duration-300",
          active
            ? "opacity-100 bg-linear-to-br from-emerald-500/12 via-lime-500/8 to-white/10"
            : "opacity-0 group-hover:opacity-100 bg-linear-to-br from-emerald-50 to-transparent"
        )}
      />

      <span
        className={cn(
          "relative z-10 flex items-center justify-center transition-all duration-300",
          active ? "scale-100 text-emerald-700" : "text-slate-500 group-hover:text-emerald-700"
        )}
      >
        <Icon
          className={cn(
            isBottom ? "h-5 w-5" : "h-4.5 w-4.5",
            "transition-all duration-300",
            active && "drop-shadow-[0_0_10px_rgba(16,185,129,0.18)]"
          )}
        />
      </span>

      {isBottom && active && (
        <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      )}
    </button>
  );
}

export default NavIcon;