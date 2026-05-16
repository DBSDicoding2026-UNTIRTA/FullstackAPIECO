"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface WasteItem {
  readonly type: string;
  readonly count: number;
  readonly percent: number;
  readonly countLabel: string;
}

interface WasteDonutChartProps {
  readonly title: string;
  readonly subtitle: string;
  readonly emptyMessage: string;
  readonly totalLabel: string;
  readonly items: ReadonlyArray<WasteItem>;
}

const DONUT_COLORS = [
  { stroke: "#10b981", bg: "bg-emerald-500" },
  { stroke: "#84cc16", bg: "bg-lime-500" },
  { stroke: "#0ea5e9", bg: "bg-sky-500" },
  { stroke: "#f59e0b", bg: "bg-amber-500" },
  { stroke: "#8b5cf6", bg: "bg-violet-500" },
  { stroke: "#f43f5e", bg: "bg-rose-500" },
];

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function WasteDonutChart({
  title,
  subtitle,
  emptyMessage,
  totalLabel,
  items,
}: WasteDonutChartProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" },
      );

      gsap.fromTo(
        ".donut-legend-item",
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          delay: 0.7,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Calculate donut segments
  let accumulatedOffset = 0;
  const segments = items.map((item, index) => {
    const dashLength = (item.percent / 100) * CIRCUMFERENCE;
    const dashGap = CIRCUMFERENCE - dashLength;
    const offset = accumulatedOffset;
    accumulatedOffset += dashLength;

    return {
      ...item,
      color: DONUT_COLORS[index % DONUT_COLORS.length],
      dashArray: `${dashLength} ${dashGap}`,
      dashOffset: -offset,
      delay: index * 0.15,
    };
  });

  return (
    <article
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_38px_-28px_rgba(16,185,129,0.5)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900"
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>

      {items.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 text-sm text-slate-500 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-slate-400">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0">
            <svg
              width="140"
              height="140"
              viewBox="0 0 100 100"
              className="-rotate-90"
            >
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-emerald-100 dark:text-emerald-950/50"
              />
              {/* Segments */}
              {segments.map((seg) => (
                <circle
                  key={seg.type}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={seg.color.stroke}
                  strokeWidth="12"
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="round"
                  className="stats-donut-segment"
                  style={{
                    ["--donut-circumference" as string]: CIRCUMFERENCE,
                    ["--donut-offset" as string]: seg.dashOffset,
                    animationDelay: `${0.5 + seg.delay}s`,
                  }}
                />
              ))}
            </svg>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {totalCount}
              </p>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                {totalLabel}
              </p>
            </div>
          </div>

          {/* Legend + bar details */}
          <div className="flex-1 space-y-3">
            {segments.map((seg) => (
              <div key={seg.type} className="donut-legend-item">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                    <span
                      className={`h-3 w-3 rounded-full ${seg.color.bg} shadow-sm`}
                    />
                    {seg.type}
                  </span>
                  <span className="tabular-nums text-slate-500 dark:text-slate-400">
                    {seg.countLabel}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <div
                    className={`stats-progress-animated h-full rounded-full ${seg.color.bg}`}
                    style={{
                      width: `${seg.percent}%`,
                      animationDelay: `${0.8 + seg.delay}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
