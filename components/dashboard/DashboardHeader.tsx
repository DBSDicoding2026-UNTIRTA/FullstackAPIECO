"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useSettings } from "@/hooks/use-settings";
import type { DashboardUser } from "@/types";

interface DashboardHeaderProps {
  readonly user: DashboardUser;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { profile, t } = useSettings();
  const headerRef = useRef<HTMLElement | null>(null);
  const displayName = profile.name || user.name;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headerRef.current) {
        return;
      }

      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
        },
      );
    }, headerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_20px_44px_-30px_rgba(16,185,129,0.55)] transition-colors duration-300 dark:border-emerald-900/60 dark:bg-slate-900 sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-linear-to-br from-emerald-300/35 to-lime-200/40 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            {t("dashboard.ecoProgress")}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {t("dashboard.greeting", { name: displayName })}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-emerald-100 bg-white/90 p-2 transition-colors duration-300 dark:border-emerald-900/60 dark:bg-slate-950/80">
          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center dark:bg-emerald-950">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("dashboard.totalPoints")}
            </p>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {user.points}
            </p>
          </div>
          <div className="rounded-xl bg-lime-50 px-3 py-2 text-center dark:bg-lime-950/40">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("dashboard.level")}
            </p>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {user.level}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

