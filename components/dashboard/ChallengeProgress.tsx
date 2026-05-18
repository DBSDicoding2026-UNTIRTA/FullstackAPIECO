"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useSettings } from "@/hooks/use-settings";
import type { ChallengeItem } from "@/types";

interface ChallengeProgressProps {
  readonly items: ReadonlyArray<ChallengeItem>;
}

function getProgressPercentage(current: number, target: number): number {
  const percentage = Math.round((current / target) * 100);
  return Math.min(100, percentage);
}

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

      const challengeItems = gsap.utils.toArray<HTMLElement>(
        sectionElement.querySelectorAll("[data-challenge-item]"),
      );
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline.fromTo(
        sectionElement,
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
      );

      if (challengeItems.length > 0) {
        timeline.from(
          challengeItems,
          {
            opacity: 0,
            y: 14,
            duration: 0.45,
            stagger: 0.1,
          },
          "-=0.35",
        );
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
      className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_34px_-24px_rgba(16,185,129,0.55)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.challenge.title")}</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("dashboard.challenge.subtitle")}</p>
      <ul className="mt-4 space-y-4">
        {items.map((item, index) => {
          const progress = getProgressPercentage(item.current, item.target);

          return (
            <li key={item.id} data-challenge-item>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="mr-1" aria-hidden>
                    {item.icon}
                  </span>
                  {item.title}
                </p>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{progress}%</p>
              </div>
              <div className="h-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                <div
                  ref={(element) => {
                    barRefs.current[index] = element;
                  }}
                  data-progress-width={`${progress}%`}
                  className="h-2.5 rounded-full bg-linear-to-r from-emerald-500 to-lime-400"
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
