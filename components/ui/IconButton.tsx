"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconButtonProps {
  icon: LucideIcon | React.ReactNode;
  href?: string;
  onClick?: () => void;
  tooltip?: string;
  active?: boolean;
  variant?: "sidebar" | "bottom";
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  href,
  onClick,
  tooltip,
  active = false,
  variant = "sidebar",
  className,
}) => {
  const content = (
    <button
      type="button"
      aria-label={tooltip}
      title={tooltip}
      onClick={onClick}
      className={cn(
        "relative z-10 flex items-center justify-center outline-none transition-all duration-200",
        variant === "bottom" ? "h-12 w-12 rounded-2xl" : "h-10 w-10 rounded-2xl",
        active
          ? "bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-[0_10px_28px_rgba(16,185,129,0.22)]"
          : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700",
        className
      )}
    >
      {typeof Icon === "function" ? (
        <Icon className={variant === "bottom" ? "h-5 w-5" : "h-4 w-4"} />
      ) : (
        Icon
      )}
    </button>
  );

  if (href) {
    return (
      <Link href={href} aria-label={tooltip} title={tooltip} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
};

export default IconButton;