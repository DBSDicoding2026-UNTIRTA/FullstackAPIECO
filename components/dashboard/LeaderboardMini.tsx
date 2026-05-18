"use client";

import { Trophy, Users } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardMiniProps {
  readonly entries: ReadonlyArray<LeaderboardEntry>;
}

export default function LeaderboardMini({ entries }: LeaderboardMiniProps) {
  const { t } = useSettings();

  return (
    <section
      className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">{t("dashboard.leaderboard.title")}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("dashboard.leaderboard.subtitle")}</p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Users className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <ol className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            data-leaderboard-item
            className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 transition-colors ${
              entry.isCurrentUser
                ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20"
                : "border-slate-200 bg-white hover:border-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900/70"
            }`}
          >
            <p className="flex min-w-0 items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {entry.rank === 1 ? <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" /> : entry.rank}
              </span>
              <span className="truncate">{entry.name}</span>
              {entry.isCurrentUser ? <span className="shrink-0 text-xs font-medium text-emerald-700 dark:text-emerald-300">{t("dashboard.leaderboard.you")}</span> : null}
            </p>
            <p className="shrink-0 text-sm font-semibold text-slate-950 dark:text-white">{entry.points} pts</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
