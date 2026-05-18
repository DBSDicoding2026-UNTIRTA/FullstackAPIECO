"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Award, BookCheck, Star, Trophy } from "lucide-react";

interface AchievementPanelProps {
  readonly title: string;
  readonly quizMasteryLabel: string;
  readonly completedModulesLabel: string;
  readonly completedModules: number;
  readonly totalModules: number;
  readonly masteredQuestionsLabel: string;
  readonly masteredQuestions: number;
  readonly totalQuestions: number;
  readonly weeklyQualityLabel: string;
  readonly weeklyQualityMessage: string;
  readonly isGoodQuality: boolean;
  readonly quizCompletionPercent: number;
}

const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function AchievementPanel(props: AchievementPanelProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const {
    title, quizMasteryLabel, completedModulesLabel, completedModules, totalModules,
    masteredQuestionsLabel, masteredQuestions, totalQuestions,
    weeklyQualityLabel, weeklyQualityMessage, isGoodQuality, quizCompletionPercent,
  } = props;

  const progressOffset = CIRCUMFERENCE - (quizCompletionPercent / 100) * CIRCUMFERENCE;

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const achievementCards = gsap.utils.toArray<HTMLElement>(
        containerRef.current.querySelectorAll("[data-achievement-card]"),
      );
      const achievementRing = containerRef.current.querySelector<SVGCircleElement>("[data-achievement-ring]");

      gsap.fromTo(containerRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.35, ease: "power3.out" });

      if (achievementCards.length > 0) {
        gsap.fromTo(achievementCards, { opacity: 0, scale: 0.9, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: 0.5, stagger: 0.1, ease: "back.out(1.3)" });
      }

      if (achievementRing) {
        gsap.fromTo(achievementRing, { strokeDashoffset: CIRCUMFERENCE }, { strokeDashoffset: progressOffset, duration: 1.5, delay: 0.8, ease: "power2.out" });
      }
    }, containerRef);
    return () => { ctx.revert(); };
  }, [quizCompletionPercent, progressOffset]);

  const cardBase = "group rounded-2xl border p-4 transition-all duration-300 hover:shadow-md";
  const cardGreen = `${cardBase} border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-lime-50/50 dark:border-emerald-900/60 dark:from-emerald-950/20 dark:to-slate-900/40`;

  return (
    <article ref={containerRef} className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_38px_-28px_rgba(16,185,129,0.5)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60">
          <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
        </div>
        {title}
      </h2>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
            <circle cx="40" cy="40" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="6" className="text-emerald-100 dark:text-emerald-950/50" />
            <circle data-achievement-ring cx="40" cy="40" r={RADIUS} fill="none" stroke="url(#achGrad)" strokeWidth="6" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={progressOffset} strokeLinecap="round" />
            <defs>
              <linearGradient id="achGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">{quizCompletionPercent}%</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{quizMasteryLabel}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{masteredQuestions}/{totalQuestions}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div data-achievement-card className={cardGreen}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60">
              <BookCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{completedModulesLabel}</p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{completedModules}/{totalModules}</p>
            </div>
          </div>
        </div>

        <div data-achievement-card className={cardGreen}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60">
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{masteredQuestionsLabel}</p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{masteredQuestions}/{totalQuestions}</p>
            </div>
          </div>
        </div>

        <div data-achievement-card className={`${cardBase} ${isGoodQuality ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-lime-50 dark:border-emerald-800/50 dark:from-emerald-950/30 dark:to-lime-950/20" : "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-orange-950/10"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isGoodQuality ? "bg-emerald-100 dark:bg-emerald-950/60" : "bg-amber-100 dark:bg-amber-950/50"}`}>
              <Star className={`h-5 w-5 ${isGoodQuality ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300"}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{weeklyQualityLabel}</p>
              <p className={`mt-0.5 text-sm font-bold leading-5 ${isGoodQuality ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>{weeklyQualityMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
