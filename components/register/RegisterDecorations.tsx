"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Leaf, Orbit, Package, Recycle, ShoppingBag, Sparkles, Trash2, Wine } from "lucide-react";

interface DecorationItem {
  id: string;
  icon: typeof Recycle;
  className: string;
  rotate?: boolean;
}

const DECORATIONS: DecorationItem[] = [
  {
    id: "recycle-top-left",
    icon: Recycle,
    className: "left-5 top-10 text-emerald-200/70 sm:left-10 lg:left-16 lg:top-14",
    rotate: true,
  },
  {
    id: "trash-left-bottom",
    icon: Trash2,
    className: "bottom-12 left-4 text-lime-200/60 sm:left-10 lg:bottom-16 lg:left-20",
  },
  {
    id: "bag-right-top",
    icon: ShoppingBag,
    className: "right-5 top-20 text-emerald-100/60 sm:right-10 lg:right-20 lg:top-16",
  },
  {
    id: "bottle-right-mid",
    icon: Wine,
    className: "right-6 bottom-28 text-cyan-200/55 sm:right-10 lg:right-20 lg:bottom-24",
    rotate: true,
  },
  {
    id: "leaf-mid",
    icon: Leaf,
    className: "left-1/4 top-1/4 text-emerald-100/55 lg:left-[28%]",
    rotate: true,
  },
  {
    id: "paper-box",
    icon: Package,
    className: "bottom-1/4 right-1/3 hidden text-lime-100/55 md:block",
  },
  {
    id: "sparkles",
    icon: Sparkles,
    className: "top-32 right-1/3 hidden text-emerald-100/65 md:block",
    rotate: true,
  },
  {
    id: "orbit-accent",
    icon: Orbit,
    className: "left-1/3 bottom-20 hidden text-cyan-100/45 lg:block",
  },
];

export default function RegisterDecorations() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      if (!wrapperRef.current) return;

      const floatingItems = gsap.utils.toArray<HTMLElement>(
        wrapperRef.current.querySelectorAll("[data-decoration-float]"),
      );
      const rotatingItems = gsap.utils.toArray<HTMLElement>(
        wrapperRef.current.querySelectorAll("[data-decoration-rotate]"),
      );
      const blobs = gsap.utils.toArray<HTMLElement>(
        wrapperRef.current.querySelectorAll("[data-blob-motion]"),
      );

      if (floatingItems.length > 0) {
        gsap.to(floatingItems, {
          y: "random(-10, 10)",
          x: "random(-6, 6)",
          duration: "random(4.8, 7.2)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: {
            each: 0.18,
            from: "random",
          },
        });
      }

      if (rotatingItems.length > 0) {
        gsap.to(rotatingItems, {
          rotate: 360,
          duration: 26,
          repeat: -1,
          ease: "none",
        });
      }

      if (blobs.length > 0) {
        gsap.to(blobs, {
          x: "+=36",
          y: "-=28",
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div data-blob-motion className="absolute left-[10%] top-[18%] h-52 w-52 rounded-full bg-emerald-400/15 blur-3xl sm:h-64 sm:w-64" />
      <div data-blob-motion className="absolute bottom-[8%] right-[8%] h-56 w-56 rounded-full bg-lime-300/15 blur-3xl sm:h-72 sm:w-72" />

      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/10" />
      <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-200/10" />

      {DECORATIONS.map((item) => {
        const Icon = item.icon;

        return (
          <Icon
            key={item.id}
            data-decoration-float
            data-decoration-rotate={item.rotate ? "" : undefined}
            className={`absolute h-5 w-5 sm:h-6 sm:w-6 ${item.className}`}
            strokeWidth={1.8}
          />
        );
      })}
    </div>
  );
}
