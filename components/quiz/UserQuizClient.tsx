"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import QuizModuleList, { type QuizModuleRecord } from "./QuizModuleList";
import QuizProgress from "./QuizProgress";
import QuizQuestionCard, { type UserQuizQuestion } from "./QuizQuestionCard";
import QuizResultPanel from "./QuizResultPanel";
import QuizSummary from "./QuizSummary";
import { useSettings } from "@/hooks/use-settings";

type AnswerResult = {
  isCorrect: boolean;
  correctAnswer: string;
  pointsEarned: number;
  totalPoints: number;
  level: number;
};

export default function UserQuizClient() {
  const { t } = useSettings();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [modules, setModules] = useState<QuizModuleRecord[]>([]);
  const [selectedModule, setSelectedModule] = useState<QuizModuleRecord | null>(
    null
  );
  const [quizzes, setQuizzes] = useState<UserQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [latestPoints, setLatestPoints] = useState<number | null>(null);
  const [latestLevel, setLatestLevel] = useState<number | null>(null);

  const currentQuiz = quizzes[currentIndex];
  const isFinished = Boolean(selectedModule) && quizzes.length > 0 && currentIndex >= quizzes.length;

  const progressValue = useMemo(() => {
    if (quizzes.length === 0) return 0;
    return Math.min(currentIndex + (result ? 1 : 0), quizzes.length);
  }, [currentIndex, quizzes.length, result]);

  async function fetchModules(): Promise<QuizModuleRecord[]> {
    const res = await fetch("/api/quiz/modules", {
      cache: "no-store",
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;

      throw new Error(payload?.message ?? t("quiz.error.loadModules"));
    }

    return (await res.json()) as QuizModuleRecord[];
  }

  async function fetchModuleQuizzes(moduleId: string): Promise<UserQuizQuestion[]> {
    const res = await fetch(`/api/quiz?moduleId=${encodeURIComponent(moduleId)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;

      throw new Error(payload?.message ?? t("quiz.error.loadQuizzes"));
    }

    return (await res.json()) as UserQuizQuestion[];
  }

  async function loadModules() {
    setLoadingModules(true);
    setError(null);

    try {
      const data = await fetchModules();
      setModules(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("quiz.error.loadModules"));
    } finally {
      setLoadingModules(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadModules();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 18, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [currentIndex, result, selectedModule]);

  async function handleSelectModule(moduleRecord: QuizModuleRecord) {
    setSelectedModule(moduleRecord);
    setQuizzes([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResult(null);
    setCorrectCount(0);
    setWrongCount(0);
    setTotalXp(0);
    setLatestPoints(null);
    setLatestLevel(null);
    setError(null);
    setLoadingQuizzes(true);

    try {
      const data = await fetchModuleQuizzes(moduleRecord.id);
      setQuizzes(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("quiz.error.loadQuizzes"));
    } finally {
      setLoadingQuizzes(false);
    }
  }

  function handleBackToModules() {
    setSelectedModule(null);
    setQuizzes([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResult(null);
    setSubmitting(false);
    setError(null);
    setCorrectCount(0);
    setWrongCount(0);
    setTotalXp(0);
    setLatestPoints(null);
    setLatestLevel(null);
  }

  async function handleSubmit() {
    if (!currentQuiz || !selectedAnswer) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: currentQuiz.id,
          selectedAnswer,
        }),
      });

      const payload = (await res.json().catch(() => null)) as
        | (AnswerResult & { message?: string })
        | null;

      if (!res.ok || !payload) {
        throw new Error(payload?.message ?? t("quiz.error.checkAnswer"));
      }

      setResult(payload);
      setLatestPoints(payload.totalPoints);
      setLatestLevel(payload.level);

      if (payload.isCorrect) {
        setCorrectCount((current) => current + 1);
        setTotalXp((current) => current + payload.pointsEarned);
      } else {
        setWrongCount((current) => current + 1);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("quiz.error.checkAnswer")
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    setSelectedAnswer(null);
    setResult(null);
    setCurrentIndex((current) => current + 1);
  }

  if (loadingModules && modules.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-[2rem] border border-dashed border-emerald-200 bg-white px-6 py-16 text-sm font-bold text-slate-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-300">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-600" />
        {t("quiz.loading.modules")}
      </div>
    );
  }

  if (!selectedModule) {
    return (
      <div className="space-y-5" ref={cardRef}>
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          </div>
        ) : null}

        <QuizModuleList modules={modules} onSelect={handleSelectModule} />
      </div>
    );
  }

  if (loadingQuizzes) {
    return (
      <div className="flex items-center justify-center rounded-[2rem] border border-dashed border-emerald-200 bg-white px-6 py-16 text-sm font-bold text-slate-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-300">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-600" />
        {t("quiz.loading.quizzes")}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-emerald-200 bg-white p-10 text-center text-sm font-bold text-slate-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-300">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
            <div className="flex items-center justify-center gap-2 font-black">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          </div>
        ) : (
          t("quiz.modules.noQuestions")
        )}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleBackToModules}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-700"
          >
            {t("quiz.actions.backToModules")}
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <QuizSummary
        moduleTitle={selectedModule.title}
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalXp={totalXp}
        level={latestLevel}
        totalPoints={latestPoints}
        onBackToModules={handleBackToModules}
      />
    );
  }

  return (
    <div className="space-y-5" ref={cardRef}>
      <section className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
              {t("quiz.modules.active")}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {selectedModule.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {selectedModule.description ?? t("quiz.modules.activeDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleBackToModules}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            {t("quiz.actions.backToModules")}
          </button>
        </div>
      </section>

      <QuizProgress current={progressValue} total={quizzes.length} />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <QuizQuestionCard
        quiz={currentQuiz}
        selectedAnswer={selectedAnswer}
        answered={Boolean(result)}
        submitting={submitting}
        onSelect={setSelectedAnswer}
        onSubmit={handleSubmit}
      />

      {result ? (
        <div className="space-y-4">
          <QuizResultPanel
            isCorrect={result.isCorrect}
            correctAnswer={result.correctAnswer}
            pointsEarned={result.pointsEarned}
          />

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white transition hover:bg-emerald-700"
          >
            {t("quiz.actions.next")}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
