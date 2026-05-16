"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Brain, CheckCircle2 } from "lucide-react";

interface ModuleItem {
  readonly id: string;
  readonly title: string;
  readonly order: number;
  readonly completed: number;
  readonly total: number;
  readonly progressPercent: number;
}

interface ModuleProgressListProps {
  readonly title: string;
  readonly subtitle: string;
  readonly completedBadge: string;
  readonly modules: ReadonlyArray<ModuleItem>;
}

export default function ModuleProgressList({
  title,
  subtitle,
  completedBadge,
  modules,
}: ModuleProgressListProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: "power3.out" },
      );

      gsap.fromTo(
        ".module-progress-item",
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          delay: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <article
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_38px_-28px_rgba(16,185,129,0.5)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900"
    >
      {/* Decorative corner gradient */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-300/10 blur-2xl dark:bg-emerald-500/5" aria-hidden="true" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60">
              <Brain className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            </div>
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-lime-50 px-4 py-2 text-sm font-black text-emerald-700 dark:from-emerald-950/50 dark:to-lime-950/30 dark:text-emerald-300">
          {completedBadge}
        </div>
      </div>

      <div className="relative mt-5 space-y-4">
        {modules.map((mod, index) => {
          const isComplete = mod.progressPercent >= 100;
          return (
            <div
              key={mod.id}
              className={`module-progress-item group rounded-xl border p-3 transition-all duration-300 ${
                isComplete
                  ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                  : "border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 dark:hover:border-emerald-900/40 dark:hover:bg-emerald-950/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="flex min-w-0 items-center gap-2 truncate font-semibold text-slate-700 dark:text-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {mod.order}
                  </span>
                  {mod.title}
                  {isComplete && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  )}
                </p>
                <p className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">
                  {mod.completed}/{mod.total}
                </p>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                <div
                  className={`stats-progress-animated h-full rounded-full transition-all duration-500 ${
                    isComplete
                      ? "bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 shadow-sm shadow-emerald-500/30"
                      : "bg-gradient-to-r from-emerald-500 to-lime-400"
                  }`}
                  style={{
                    width: `${mod.progressPercent}%`,
                    animationDelay: `${0.6 + index * 0.12}s`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
