"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, BookOpenText, Loader2, PlusCircle } from "lucide-react";

import type { AdminQuizAnswer, AdminQuizModule } from "./types";
import { modulesChangedEventName, quizChangedEventName } from "./events";
import ModuleCombobox from "./ModuleCombobox";
import { useSettings } from "@/hooks/use-settings";

export default function QuizForm() {
  const router = useRouter();
  const { t } = useSettings();

  const [modules, setModules] = useState<AdminQuizModule[]>([]);
  const [moduleId, setModuleId] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<AdminQuizAnswer>("A");
  const [points, setPoints] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [modulesRefreshCount, setModulesRefreshCount] = useState(0);

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === moduleId) ?? null,
    [moduleId, modules]
  );

  useEffect(() => {
    let active = true;

    async function loadModules() {
      setModulesLoading(true);
      setModulesError(null);

      try {
        const res = await fetch("/api/admin/modules", {
          cache: "no-store",
        });

        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as
            | { message?: string }
            | null;

          throw new Error(payload?.message ?? "Gagal memuat daftar modul.");
        }

        const data = (await res.json()) as AdminQuizModule[];

        if (!active) return;

        setModules(data);
        setModuleId((currentModuleId) => {
          if (
            currentModuleId &&
            data.some((module) => module.id === currentModuleId)
          ) {
            return currentModuleId;
          }

          return data[0]?.id ?? "";
        });
      } catch (loadError) {
        if (active) {
          setModulesError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat daftar modul.",
          );
        }
      } finally {
        if (active) {
          setModulesLoading(false);
        }
      }
    }

    void loadModules();

    return () => {
      active = false;
    };
  }, [modulesRefreshCount]);

  useEffect(() => {
    function handleModulesRefresh() {
      setModulesRefreshCount((current) => current + 1);
    }

    window.addEventListener(modulesChangedEventName, handleModulesRefresh);

    return () => {
      window.removeEventListener(modulesChangedEventName, handleModulesRefresh);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!moduleId) {
      alert(t("admin.quiz.form.alertSelectModule"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId,
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer,
          points,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;

        alert(payload?.message ?? t("admin.quiz.form.alertCreateFailed"));
        return;
      }

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("A");
      setPoints(10);

      window.dispatchEvent(new Event(quizChangedEventName));
      router.refresh();
    } catch {
      alert(t("admin.quiz.form.alertCreateFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900"
    >
      <div className="flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-emerald-600" />
        <h2 className="text-xl font-black tracking-tight dark:text-white">
          {t("admin.quiz.form.title")}
        </h2>
      </div>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
        {t("admin.quiz.form.subtitle")}
      </p>

      <div className="mt-5">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {t("admin.quiz.form.moduleLabel")}
        </label>
        <ModuleCombobox
          modules={modules}
          value={moduleId}
          onValueChange={setModuleId}
          loading={modulesLoading}
          disabled={modules.length === 0}
          placeholder={t("admin.quiz.form.noModules")}
          searchPlaceholder="Cari modul..."
          emptyText="Modul tidak ditemukan."
          loadingText="Memuat modul..."
          className="mt-2"
        />
      </div>

      {modulesError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4" />
            {modulesError}
          </div>
        </div>
      ) : null}

      {!modulesLoading && modules.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-5 text-sm text-slate-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-slate-300">
          <p className="font-black text-slate-900 dark:text-white">
            {t("admin.quiz.form.noModules")}
          </p>
          <p className="mt-1 leading-6">
            Buat modul quiz terlebih dahulu melalui endpoint admin module agar quiz baru memiliki relasi yang valid.
          </p>
        </div>
      ) : null}

      {selectedModule ? (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-200">
              <BookOpenText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                {t("admin.quiz.form.selectedModule")}
              </p>

              <h3 className="mt-1 text-base font-black text-slate-900 dark:text-white">
                Modul {selectedModule.order}: {selectedModule.title}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {selectedModule.description ?? t("admin.quiz.list.moduleDescription")}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {t("admin.quiz.form.xpReward")}: {selectedModule.xpReward}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {t("admin.quiz.form.questionCount")}: {selectedModule.questionCount}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {t("admin.quiz.form.status")}: {selectedModule.isActive ? t("admin.quiz.form.statusActive") : t("admin.quiz.form.statusInactive")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {t("admin.quiz.form.questionLabel")}
        </label>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          required
          placeholder={t("admin.quiz.form.questionPlaceholder")}
          className="mt-2 min-h-28 w-full rounded-2xl border border-emerald-100 p-4 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="mt-5 grid gap-3">
        <input
          value={optionA}
          onChange={(event) => setOptionA(event.target.value)}
          required
          placeholder={t("admin.quiz.form.optionA")}
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
        />

        <input
          value={optionB}
          onChange={(event) => setOptionB(event.target.value)}
          required
          placeholder={t("admin.quiz.form.optionB")}
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
        />

        <input
          value={optionC}
          onChange={(event) => setOptionC(event.target.value)}
          required
          placeholder={t("admin.quiz.form.optionC")}
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
        />

        <input
          value={optionD}
          onChange={(event) => setOptionD(event.target.value)}
          required
          placeholder={t("admin.quiz.form.optionD")}
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("admin.quiz.form.correctAnswer")}
          </label>
          <select
            value={correctAnswer}
            onChange={(event) =>
              setCorrectAnswer(event.target.value as AdminQuizAnswer)
            }
            className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("admin.quiz.form.points")}
          </label>
          <input
            type="number"
            min={1}
            value={points}
            onChange={(event) => setPoints(Number(event.target.value))}
            required
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || modulesLoading || modules.length === 0}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("admin.quiz.form.saving")}
          </>
        ) : (
          t("admin.quiz.form.save")
        )}
      </button>
    </form>
  );
}
