"use client";

import { CheckCircle2, Leaf, Target, Trophy, type LucideIcon } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";
import type { UserBadge } from "@/types";

interface BadgeCardProps {
  readonly badge: UserBadge;
  readonly index: number;
}

const badgeIconMap: Record<string, LucideIcon> = {
  "badge-xp-starter": Trophy,
  "badge-quiz-challenger": Target,
  "badge-eco-beginner": Leaf,
  "badge-consistency": CheckCircle2,
};

export default function BadgeCard({ badge, index }: BadgeCardProps) {
  const { t } = useSettings();
  const Icon = badgeIconMap[badge.id] ?? Trophy;

  return (
    <article
      className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 dark:bg-slate-900 ${
        badge.unlocked
          ? "border-emerald-200 dark:border-emerald-900"
          : "border-slate-200 dark:border-slate-800"
      }`}
      style={{ transitionDelay: `${index * 20}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
            badge.unlocked ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            badge.unlocked
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {badge.unlocked ? t("dashboard.badge.active") : t("dashboard.badge.progress")}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-950 dark:text-white">{badge.name}</h3>
      <p className="mt-1 min-h-10 text-xs leading-5 text-slate-600 dark:text-slate-300">{badge.description}</p>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{t("dashboard.badge.milestone")}</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
            {badge.progressLabel}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-emerald-500"
            style={{ width: `${badge.progressPercent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
