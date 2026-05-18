"use client";

import { BarChart3, Leaf, Target, Trophy, type LucideIcon } from "lucide-react";

import type { DashboardStatItem } from "@/types";

interface StatCardProps {
  readonly item: DashboardStatItem;
  readonly index: number;
}

const toneClassMap: Record<DashboardStatItem["tone"], string> = {
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
};

const iconMap: Record<string, LucideIcon> = {
  points: Trophy,
  level: BarChart3,
  recycled: Leaf,
  badge: Target,
};

export default function StatCard({ item, index }: StatCardProps) {
  const Icon = iconMap[item.id] ?? BarChart3;

  return (
    <article
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900/70"
      style={{ transitionDelay: `${index * 20}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${toneClassMap[item.tone]}`} aria-hidden="true">
          <Icon className="h-4 w-4" />
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {item.progressPercent}%
        </span>
      </div>

      <p className="mt-4 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
      <p className="mt-1 truncate text-xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
      <p className="mt-1 min-h-8 text-xs leading-4 text-slate-500 dark:text-slate-400">{item.caption}</p>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        aria-label={`${item.label} progress ${item.progressPercent}%`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={item.progressPercent}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
          style={{ width: `${item.progressPercent}%` }}
        />
      </div>
    </article>
  );
}
