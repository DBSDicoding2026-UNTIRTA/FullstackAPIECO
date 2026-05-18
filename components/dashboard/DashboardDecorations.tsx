"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DecorationItem {
  readonly id: string;
  readonly icon: string;
  readonly className: string;
  readonly rotate?: boolean;
}

const DASHBOARD_DECORATIONS: ReadonlyArray<DecorationItem> = [
  {
    id: "recycle-top-left",
    icon: "♻️",
    className: "left-3 top-24 text-2xl sm:left-8 sm:text-3xl",
    rotate: true,
  },
  {
    id: "trash-bin-left-bottom",
    icon: "🗑️",
    className: "bottom-20 left-4 text-2xl sm:left-10 sm:text-3xl",
  },
  {
    id: "trash-bag-right-top",
    icon: "🛍️",
    className: "right-5 top-20 text-2xl sm:right-10 sm:text-3xl",
  },
  {
    id: "plastic-bottle-right-mid",
    icon: "🧴",
    className: "right-4 top-1/2 hidden text-2xl md:block md:text-3xl",
  },
  {
    id: "leaf-mid-left",
    icon: "🍃",
    className: "left-1/4 top-1/3 hidden text-2xl md:block md:text-3xl",
    rotate: true,
  },
  {
    id: "paper-cardboard",
    icon: "📦",
    className: "bottom-28 right-1/4 hidden text-2xl lg:block lg:text-3xl",
  },
  {
    id: "sparkles-ai",
    icon: "✨",
    className: "right-1/3 top-28 hidden text-2xl md:block md:text-3xl",
    rotate: true,
  },
  {
    id: "paper-sheet",
    icon: "📄",
    className: "bottom-24 left-1/2 hidden text-2xl lg:block",
  },
];

export default function DashboardDecorations() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      if (!wrapperRef.current) return;

      const floatingItems = gsap.utils.toArray<HTMLElement>(
        wrapperRef.current.querySelectorAll("[data-dashboard-float]"),
      );
      const rotatingItems = gsap.utils.toArray<HTMLElement>(
        wrapperRef.current.querySelectorAll("[data-dashboard-rotate]"),
      );
      const blobs = gsap.utils.toArray<HTMLElement>(
        wrapperRef.current.querySelectorAll("[data-dashboard-blob]"),
      );

      if (floatingItems.length > 0) {
        gsap.to(floatingItems, {
          y: (index: number) => (index % 2 === 0 ? -12 : 10),
          x: (index: number) => (index % 3 === 0 ? 8 : -7),
          duration: (index: number) => 5.6 + index * 0.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.16,
        });
      }

      if (rotatingItems.length > 0) {
        gsap.to(rotatingItems, {
          rotate: 360,
          duration: 24,
          repeat: -1,
          ease: "none",
        });
      }

      if (blobs.length > 0) {
        gsap.to(blobs, {
          x: "+=28",
          y: "-=20",
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.5,
        });
      }
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div data-dashboard-blob className="absolute -left-16 top-24 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl sm:h-64 sm:w-64" />
      <div data-dashboard-blob className="absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-lime-300/20 blur-3xl sm:h-80 sm:w-80" />
      <div data-dashboard-blob className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-emerald-200/20 blur-3xl sm:h-72 sm:w-72" />

      {DASHBOARD_DECORATIONS.map((item) => (
        <span
          key={item.id}
          data-dashboard-float
          data-dashboard-rotate={item.rotate ? "" : undefined}
          className={`absolute opacity-20 ${item.className}`}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
