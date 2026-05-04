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

import QuizCard, { type QuizQuestionRecord } from "./QuizCard";

const refreshEventName = "admin-quiz:changed";
const itemsPerPage = 3;

async function fetchQuizzes() {
  const res = await fetch("/api/admin/quiz", {
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "Gagal memuat daftar quiz.");
  }

  return (await res.json()) as QuizQuestionRecord[];
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizQuestionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(quizzes.length / itemsPerPage));

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return quizzes.slice(startIndex, endIndex);
  }, [quizzes, currentPage]);

  useEffect(() => {
    let active = true;

    async function loadQuizzes() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchQuizzes();

        if (active) {
          setQuizzes(data);
          setCurrentPage(1);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat daftar quiz."
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
  }, [refreshCount]);

  useEffect(() => {
    function handleRefresh() {
      setRefreshCount((current) => current + 1);
    }

    window.addEventListener(refreshEventName, handleRefresh);

    return () => {
      window.removeEventListener(refreshEventName, handleRefresh);
    };
  }, []);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black tracking-tight">Daftar Quiz</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Pertanyaan yang tersedia untuk user.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshCount((current) => current + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
        >
          <RefreshCw className="h-4 w-4" />
          {quizzes.length} Quiz
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-emerald-200 px-6 py-10 text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
            Memuat daftar quiz...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 p-8 text-center text-sm text-slate-500">
            Belum ada quiz.
          </div>
        ) : (
          paginatedQuizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              index={(currentPage - 1) * itemsPerPage + index}
            />
          ))
        )}
      </div>

      {!loading && !error && quizzes.length > itemsPerPage ? (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-emerald-100 pt-5 sm:flex-row">
          <p className="text-sm font-medium text-slate-500">
            Halaman {currentPage} dari {totalPages}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                      : "border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}