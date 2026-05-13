"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import type { DashboardStatItem } from "@/types";

interface StatCardProps {
  readonly item: DashboardStatItem;
  readonly index: number;
}

const toneClassMap: Record<DashboardStatItem["tone"], string> = {
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  sky: "bg-teal-50 text-emerald-700 dark:bg-teal-950/50 dark:text-emerald-300",
  amber: "bg-lime-50 text-emerald-700 dark:bg-lime-950/50 dark:text-emerald-300",
  violet: "bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
};

export default function StatCard({ item, index }: StatCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!cardRef.current) {
        return;
      }

      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 26,
        },
        {
          opacity: 1,
          y: 0,
          delay: index * 0.1,
          duration: 0.55,
          ease: "power2.out",
        },
      );
    }, cardRef);

    return () => {
      ctx.revert();
    };
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_12px_32px_-24px_rgba(16,185,129,0.6)] transition hover:-translate-y-0.5 dark:border-emerald-900/60 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <p className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${toneClassMap[item.tone]}`} aria-hidden>
          {item.icon}
        </p>
        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300 dark:bg-emerald-600" aria-hidden="true" />
      </div>

      <p className="mt-3 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
      <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">{item.value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.caption}</p>

      <p className="mt-3 h-1.5 w-14 rounded-full bg-linear-to-r from-emerald-500 to-lime-400" aria-hidden="true" />
    </article>
  );
}
