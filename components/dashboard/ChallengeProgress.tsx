"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CheckCircle2, Target, TrendingUp, type LucideIcon } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";
import type { ChallengeItem } from "@/types";

interface ChallengeProgressProps {
  readonly items: ReadonlyArray<ChallengeItem>;
}

function getProgressPercentage(current: number, target: number): number {
  const percentage = Math.round((current / target) * 100);
  return Math.min(100, percentage);
}

const challengeIconMap: Record<string, LucideIcon> = {
  "plastic-10": Target,
  "daily-streak-7": CheckCircle2,
  "points-500": TrendingUp,
};

export default function ChallengeProgress({ items }: ChallengeProgressProps) {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLElement | null>(null);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const sectionElement = sectionRef.current;
      if (!sectionElement) {
        return;
      }

      barRefs.current.forEach((bar, index) => {
        if (!bar) {
          return;
        }

        const targetWidth = bar.dataset.progressWidth ?? "0%";

        gsap.fromTo(
          bar,
          {
            width: "0%",
          },
          {
            width: targetWidth,
            duration: 0.9,
            delay: 0.28 + index * 0.1,
            ease: "power3.out",
          },
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [items]);

  return (
    <section
      ref={sectionRef}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">{t("dashboard.challenge.title")}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("dashboard.challenge.subtitle")}</p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Target className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <ul className="mt-5 space-y-4">
        {items.map((item, index) => {
          const progress = getProgressPercentage(item.current, item.target);
          const Icon = challengeIconMap[item.id] ?? Target;

          return (
            <li key={item.id} data-challenge-item>
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" aria-hidden="true">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.title}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{progress}%</p>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  ref={(element) => {
                    barRefs.current[index] = element;
                  }}
                  data-progress-width={`${progress}%`}
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: "0%" }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
