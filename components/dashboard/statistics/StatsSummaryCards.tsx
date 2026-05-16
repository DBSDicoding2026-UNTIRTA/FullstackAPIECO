"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Gauge, Recycle, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  recycle: Recycle,
  gauge: Gauge,
  zap: Zap,
  target: Target,
};

interface StatSummaryItem {
  readonly iconKey: string;
  readonly label: string;
  readonly value: string;
  readonly rawValue: number;
  readonly caption: string;
  readonly gradient: string;
  readonly iconGradient: string;
}

interface StatsSummaryCardsProps {
  readonly items: ReadonlyArray<StatSummaryItem>;
}

export default function StatsSummaryCards({ items }: StatsSummaryCardsProps) {
  const gridRef = useRef<HTMLElement | null>(null);
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance
      gsap.fromTo(
        ".stats-summary-card",
        { opacity: 0, y: 28, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.3)",
        },
      );

      // Count-up animation for numbers
      numberRefs.current.forEach((el, index) => {
        if (!el) return;
        const target = items[index]?.rawValue ?? 0;

        // Determine if the value looks like a percentage
        const isPercent = items[index]?.value?.includes("%") ?? false;

        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 1.5,
          delay: 0.3 + index * 0.12,
          ease: "power2.out",
          onUpdate: () => {
            if (el) {
              if (isPercent) {
                el.textContent = `${Math.round(proxy.val)}%`;
              } else {
                el.textContent = new Intl.NumberFormat().format(
                  Math.round(proxy.val),
                );
              }
            }
          },
        });
      });
    }, gridRef);

    return () => {
      ctx.revert();
    };
  }, [items]);

  return (
    <section
      ref={gridRef}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item, index) => {
        const Icon = ICON_MAP[item.iconKey] ?? Recycle;
        return (
          <article
            key={item.label}
            className="stats-summary-card group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_14px_34px_-26px_rgba(16,185,129,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-26px_rgba(16,185,129,0.55)] dark:border-emerald-900/60 dark:bg-slate-900"
          >
            {/* Subtle gradient accent */}
            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40 ${item.gradient}`}
              aria-hidden="true"
            />

            <div className="relative flex items-start justify-between gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconGradient}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className="mt-1 h-2 w-2 rounded-full bg-emerald-400 transition-all duration-500 group-hover:scale-150 group-hover:bg-lime-400"
                aria-hidden="true"
              />
            </div>

            <p className="relative mt-4 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
              {item.label}
            </p>
            <p
              ref={(el) => {
                numberRefs.current[index] = el;
              }}
              className="relative mt-1 text-2xl font-black tabular-nums tracking-tight text-emerald-700 dark:text-emerald-300"
            >
              {item.value}
            </p>
            <p className="relative mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {item.caption}
            </p>

            {/* Bottom sparkline accent */}
            <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <div
                className="stats-progress-animated h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                style={{
                  width: `${Math.min(100, Math.max(8, (item.rawValue / (Math.max(...items.map(i => i.rawValue)) || 1)) * 100))}%`,
                  animationDelay: `${0.5 + index * 0.15}s`,
                }}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
