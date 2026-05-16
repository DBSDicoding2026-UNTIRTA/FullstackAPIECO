"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CalendarDays, CheckCircle2, ImageIcon, BrainCircuit, XCircle } from "lucide-react";

interface ActivityItem {
  readonly id: string;
  readonly type: "upload" | "quiz";
  readonly headline: string;
  readonly detail: string;
  readonly timestamp: string;
  readonly accent: string;
  readonly isCorrect?: boolean;
}

interface ActivityTimelineProps {
  readonly title: string;
  readonly emptyMessage: string;
  readonly activities: ReadonlyArray<ActivityItem>;
}

export default function ActivityTimeline({ title, emptyMessage, activities }: ActivityTimelineProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" });
      gsap.fromTo(".timeline-item", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.45, delay: 0.6, stagger: 0.08, ease: "power2.out" });
      gsap.fromTo(".timeline-line", { scaleY: 0 }, { scaleY: 1, duration: 0.8, delay: 0.5, ease: "power2.out", transformOrigin: "top" });
    }, containerRef);
    return () => { ctx.revert(); };
  }, []);

  return (
    <section ref={containerRef} className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_38px_-28px_rgba(16,185,129,0.5)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60">
          <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
        </div>
        {title}
      </h2>

      {activities.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 text-sm text-slate-500 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-slate-400">{emptyMessage}</p>
      ) : (
        <div className="relative mt-5">
          {/* Vertical timeline line */}
          <div className="timeline-line absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-emerald-300 via-emerald-200 to-transparent dark:from-emerald-700 dark:via-emerald-900" aria-hidden="true" />

          <div className="space-y-1">
            {activities.map((activity, index) => {
              const isUpload = activity.type === "upload";
              const isEven = index % 2 === 0;

              return (
                <article key={activity.id} className={`timeline-item group relative flex items-start gap-4 rounded-2xl p-3 transition-all duration-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 ${isEven ? "" : ""}`}>
                  {/* Timeline node */}
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${
                    isUpload
                      ? "bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700 dark:from-emerald-950/60 dark:to-lime-950/40 dark:text-emerald-300"
                      : activity.isCorrect
                        ? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-950/60 dark:to-teal-950/40 dark:text-emerald-300"
                        : "bg-gradient-to-br from-rose-100 to-orange-100 text-rose-600 dark:from-rose-950/40 dark:to-orange-950/30 dark:text-rose-400"
                  }`}>
                    {isUpload ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : activity.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{activity.headline}</h3>
                      {activity.type === "quiz" && activity.isCorrect && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> OK
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{activity.detail}</p>
                    <p className="mt-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{activity.timestamp}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
