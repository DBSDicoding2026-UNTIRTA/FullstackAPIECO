"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LineChart } from "lucide-react";

interface ChartPoint {
  readonly key: string;
  readonly label: string;
  readonly uploads: number;
  readonly quizXp: number;
  readonly uploadLabel: string;
  readonly quizXpLabel: string;
}

interface TrendChartProps {
  readonly title: string;
  readonly subtitle: string;
  readonly uploadLegend: string;
  readonly quizXpLegend: string;
  readonly points: ReadonlyArray<ChartPoint>;
}

export default function TrendChart({
  title,
  subtitle,
  uploadLegend,
  quizXpLegend,
  points,
}: TrendChartProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const maxUploads = Math.max(...points.map((p) => p.uploads), 1);
  const maxQuizXp = Math.max(...points.map((p) => p.quizXp), 1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" },
      );

      gsap.fromTo(
        ".trend-bar",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.7,
          delay: 0.5,
          stagger: 0.03,
          ease: "back.out(1.5)",
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
      {/* Background mesh gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-lime-50/30 dark:from-emerald-950/20 dark:to-transparent" aria-hidden="true" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60">
              <LineChart className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            </div>
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/30" />
            {uploadLegend}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-lime-400 to-lime-300 shadow-sm shadow-lime-400/30" />
            {quizXpLegend}
          </span>
        </div>
      </div>

      <div className="relative mt-6 overflow-x-auto pb-2">
        {/* Horizontal grid lines */}
        <div className="pointer-events-none absolute inset-0 flex min-w-[720px] flex-col justify-between px-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-px w-full bg-slate-100 dark:bg-slate-800/60"
            />
          ))}
        </div>

        <div
          className="relative grid min-w-[720px] items-end gap-2 pb-7"
          style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
        >
          {points.map((point, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={point.key}
                className="group relative flex min-w-0 flex-col items-center gap-2"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  className={`flex h-44 w-full max-w-10 items-end justify-center gap-1 rounded-full px-1.5 py-2 transition-colors duration-200 ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-950/50"
                      : "bg-slate-50 dark:bg-slate-950/70"
                  }`}
                >
                  <span
                    className="trend-bar w-2.5 origin-bottom rounded-full bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/20 transition-all duration-200"
                    style={{
                      height: `${Math.max(4, (point.uploads / maxUploads) * 100)}%`,
                      animationDelay: `${index * 0.04}s`,
                    }}
                  />
                  <span
                    className="trend-bar w-2.5 origin-bottom rounded-full bg-gradient-to-t from-lime-500 to-lime-300 shadow-sm shadow-lime-400/20 transition-all duration-200"
                    style={{
                      height: `${Math.max(4, (point.quizXp / maxQuizXp) * 100)}%`,
                      animationDelay: `${index * 0.04 + 0.02}s`,
                    }}
                  />
                </div>
                <p
                  className={`mt-1 w-full truncate text-center text-[11px] leading-tight transition-colors duration-200 ${
                    isActive
                      ? "font-semibold text-emerald-700 dark:text-emerald-300"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {point.label}
                </p>

                {/* Tooltip */}
                <div
                  className={`pointer-events-none absolute bottom-full z-20 mb-3 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white shadow-2xl transition-all duration-200 dark:bg-slate-800 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0"
                  }`}
                >
                  <p className="font-bold">{point.label}</p>
                  <p className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {point.uploadLabel}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                    {point.quizXpLabel}
                  </p>
                  {/* Tooltip arrow */}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
