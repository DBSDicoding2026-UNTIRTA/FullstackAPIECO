"use client";

import { Leaf, Trophy } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";
import type { DashboardUser } from "@/types";

interface DashboardHeaderProps {
  readonly user: DashboardUser;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { profile, t } = useSettings();
  const displayName = profile.name || user.name;

  return (
    <header
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-7"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-lime-400 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
            {t("dashboard.ecoProgress")}
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {t("dashboard.greeting", { name: displayName })}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="grid min-w-full grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-colors duration-300 sm:min-w-72 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="rounded-xl bg-white px-4 py-3 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("dashboard.totalPoints")}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
              {user.points}
            </p>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 dark:bg-slate-900">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              {t("dashboard.level")}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
              {user.level}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
