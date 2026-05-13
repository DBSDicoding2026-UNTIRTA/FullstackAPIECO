"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import QuizCard from "./QuizCard";
import ModuleCombobox, { allModulesValue } from "./ModuleCombobox";
import type { AdminQuizModule, AdminQuizRecord } from "./types";
import { modulesChangedEventName, quizChangedEventName } from "./events";
import { useSettings } from "@/hooks/use-settings";

const itemsPerPage = 3;

async function fetchQuizzes(moduleId?: string) {
  const url = moduleId
    ? `/api/admin/quiz?moduleId=${encodeURIComponent(moduleId)}`
    : "/api/admin/quiz";

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "Gagal memuat daftar quiz.");
  }

  return (await res.json()) as AdminQuizRecord[];
}

async function fetchModules() {
  const res = await fetch("/api/admin/modules", {
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "Gagal memuat daftar modul.");
  }

  return (await res.json()) as AdminQuizModule[];
}

export default function QuizList() {
  const { t } = useSettings();
  const [quizzes, setQuizzes] = useState<AdminQuizRecord[]>([]);
  const [modules, setModules] = useState<AdminQuizModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState(allModulesValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedModule = useMemo(() => {
    if (selectedModuleId === allModulesValue) return null;

    return modules.find((module) => module.id === selectedModuleId) ?? null;
  }, [modules, selectedModuleId]);

  const filteredQuizzes = useMemo(() => {
    if (selectedModuleId === allModulesValue) {
      return quizzes;
    }

    return quizzes.filter((quiz) => quiz.moduleId === selectedModuleId);
  }, [quizzes, selectedModuleId]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuizzes.length / itemsPerPage)
  );

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredQuizzes.slice(startIndex, endIndex);
  }, [filteredQuizzes, currentPage]);

  useEffect(() => {
    let active = true;

    async function loadQuizzes() {
      setLoading(true);
      setError(null);

      try {
        const activeModuleId =
          selectedModuleId === allModulesValue ? undefined : selectedModuleId;
        const [quizData, moduleData] = await Promise.all([
          fetchQuizzes(activeModuleId),
          fetchModules(),
        ]);

        if (active) {
          setQuizzes(quizData);
          setModules(moduleData);
          setSelectedModuleId((currentModuleId) => {
            if (
              currentModuleId === allModulesValue ||
              moduleData.some((module) => module.id === currentModuleId)
            ) {
              return currentModuleId;
            }

            return allModulesValue;
          });
          setCurrentPage(1);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : t("admin.quiz.list.error")
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadQuizzes();

    return () => {
      active = false;
    };
  }, [refreshCount, selectedModuleId, t]);

  useEffect(() => {
    function handleRefresh() {
      setRefreshCount((current) => current + 1);
    }

    window.addEventListener(quizChangedEventName, handleRefresh);
    window.addEventListener(modulesChangedEventName, handleRefresh);

    return () => {
      window.removeEventListener(quizChangedEventName, handleRefresh);
      window.removeEventListener(modulesChangedEventName, handleRefresh);
    };
  }, []);

  function handleChangeModule(moduleId: string) {
    setSelectedModuleId(moduleId);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black tracking-tight dark:text-white">
              {t("admin.quiz.list.title")}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            {t("admin.quiz.list.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshCount((current) => current + 1)}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          <RefreshCw className="h-4 w-4" />
          {t("admin.quiz.list.count", { count: filteredQuizzes.length })}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
        <label className="text-sm font-black text-slate-700 dark:text-slate-200">
          {t("admin.quiz.list.filterLabel")}
        </label>

        <ModuleCombobox
          modules={modules}
          value={selectedModuleId}
          onValueChange={handleChangeModule}
          loading={loading && modules.length === 0}
          includeAllOption
          allLabel={t("admin.quiz.list.allModules")}
          placeholder={t("admin.quiz.form.noModules")}
          searchPlaceholder="Cari modul..."
          emptyText="Modul tidak ditemukan."
          loadingText="Memuat modul..."
          className="mt-2"
        />

        {selectedModule ? (
          <div className="mt-3 rounded-2xl bg-white p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-black text-slate-900 dark:text-white">
              Modul {selectedModule.order}: {selectedModule.title}
            </p>
            <p className="mt-1">
              {selectedModule.description ?? t("admin.quiz.list.moduleDescription")}
            </p>
            <p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {t("admin.quiz.list.moduleTotal", { count: filteredQuizzes.length })}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-emerald-200 px-6 py-10 text-sm text-slate-500 dark:border-emerald-900/60 dark:text-slate-300">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
            {t("admin.quiz.list.loading")}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        ) : modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-8 text-center text-sm text-slate-500 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-slate-300">
            <p className="font-black text-slate-900 dark:text-white">
              {t("admin.quiz.form.noModules")}
            </p>
            <p className="mt-2">
              Daftar quiz akan muncul setelah modul pertama dibuat.
            </p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 p-8 text-center text-sm text-slate-500 dark:border-emerald-900/60 dark:text-slate-300">
            {t("admin.quiz.list.empty")}
          </div>
        ) : (
          paginatedQuizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              modules={modules}
              index={(currentPage - 1) * itemsPerPage + index}
            />
          ))
        )}
      </div>

      {!loading && !error && filteredQuizzes.length > itemsPerPage ? (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-emerald-100 pt-5 sm:flex-row">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
            {t("admin.quiz.list.page", { current: currentPage, total: totalPages })}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`h-10 w-10 rounded-full text-sm font-black transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                      : "border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
