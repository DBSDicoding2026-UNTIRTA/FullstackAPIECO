"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BarChart3, Sparkles, TrendingUp } from "lucide-react";

interface StatsHeroHeaderProps {
  readonly badge: string;
  readonly title: string;
  readonly subtitle: string;
  readonly pointsLabel: string;
  readonly levelLabel: string;
  readonly points: string;
  readonly level: number;
}

export default function StatsHeroHeader({
  badge,
  title,
  subtitle,
  pointsLabel,
  levelLabel,
  points,
  level,
}: StatsHeroHeaderProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stats-hero-badge",
        { opacity: 0, y: -12, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      );
      gsap.fromTo(
        ".stats-hero-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out" },
      );
      gsap.fromTo(
        ".stats-hero-subtitle",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        ".stats-hero-quick-stat",
        { opacity: 0, scale: 0.85, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          delay: 0.4,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] sm:p-8 dark:border-emerald-900/60 dark:bg-slate-900"
    >
      {/* decorative gradient orbs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-lime-300/10 blur-3xl dark:bg-lime-500/5" aria-hidden="true" />

      <div className="relative flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="stats-hero-badge inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
            <BarChart3 className="h-4 w-4" />
            {badge}
          </p>
          <h1 className="stats-hero-title mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {title}
          </h1>
          <p className="stats-hero-subtitle mt-3 flex items-center gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <Sparkles className="hidden h-4 w-4 text-emerald-500 sm:inline" />
            {subtitle}
          </p>
        </div>

        <div className="grid min-w-56 grid-cols-2 gap-2 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-lime-50/60 p-3 dark:border-emerald-900/60 dark:from-emerald-950/30 dark:to-slate-900/60">
          <div className="stats-hero-quick-stat group rounded-xl bg-white px-4 py-3 transition-shadow hover:shadow-md dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {pointsLabel}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xl font-black text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="h-4 w-4 opacity-50" />
              {points}
            </p>
          </div>
          <div className="stats-hero-quick-stat group rounded-xl bg-white px-4 py-3 transition-shadow hover:shadow-md dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {levelLabel}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xl font-black text-emerald-700 dark:text-emerald-300">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                ★
              </span>
              {level}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
