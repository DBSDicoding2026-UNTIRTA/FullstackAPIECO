"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useSettings } from "@/hooks/use-settings";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardMiniProps {
  readonly entries: ReadonlyArray<LeaderboardEntry>;
}

export default function LeaderboardMini({ entries }: LeaderboardMiniProps) {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) {
        return;
      }

      const leaderboardItems = gsap.utils.toArray<HTMLElement>(
        sectionRef.current.querySelectorAll("[data-leaderboard-item]"),
      );
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          delay: 0.25,
        },
      );

      if (leaderboardItems.length > 0) {
        timeline.from(
          leaderboardItems,
          {
            opacity: 0,
            x: 10,
            duration: 0.35,
            stagger: 0.08,
          },
          "-=0.35",
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [entries]);

  return (
    <section
      ref={sectionRef}
      className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_34px_-24px_rgba(16,185,129,0.55)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.leaderboard.title")}</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("dashboard.leaderboard.subtitle")}</p>
      <ol className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            data-leaderboard-item
            className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 ${
              entry.isCurrentUser
                ? "border-emerald-300 bg-linear-to-r from-emerald-50 to-lime-50 dark:border-emerald-700 dark:from-emerald-950/40 dark:to-lime-950/20"
                : "border-emerald-100 bg-white dark:border-emerald-900/60 dark:bg-slate-800/50"
            }`}
          >
            <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                {entry.rank}
              </span>
              {entry.name}
              {entry.isCurrentUser ? <span className="text-emerald-700 dark:text-emerald-300">{t("dashboard.leaderboard.you")}</span> : null}
            </p>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{entry.points} pts</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
