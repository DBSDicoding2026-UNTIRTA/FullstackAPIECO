"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";

export type QuizQuestionRecord = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  points: number;
  createdAt: string;
  updatedAt: string;
};

const refreshEventName = "admin-quiz:changed";

type QuizCardProps = {
  index: number;
  quiz: QuizQuestionRecord;
};

export default function QuizCard({ quiz, index }: QuizCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmDelete = window.confirm("Yakin ingin menghapus quiz ini?");

    if (!confirmDelete) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/quiz/${quiz.id}`, {
        method: "DELETE",
      });

      const payload = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!res.ok) {
        setError(payload?.message ?? "Gagal menghapus quiz.");
        return;
      }

      window.dispatchEvent(new CustomEvent(refreshEventName));
      router.refresh();
    } catch {
      setError("Terjadi gangguan saat menghapus quiz.");
    } finally {
      setDeleting(false);
    }
  }

  const options = [
    { label: "A", value: quiz.optionA },
    { label: "B", value: quiz.optionB },
    { label: "C", value: quiz.optionC },
    { label: "D", value: quiz.optionD },
  ];

  return (
    <article className="rounded-[1.5rem] border border-emerald-100 bg-[#f8fffb] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Level {index + 1}
          </span>

          <h3 className="mt-3 font-bold text-slate-900">{quiz.question}</h3>
        </div>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
          +{quiz.points} XP
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <div
            key={option.label}
            className={`rounded-2xl border p-3 text-sm ${
              quiz.correctAnswer === option.label
                ? "border-emerald-400 bg-emerald-50 font-semibold text-emerald-700"
                : "border-slate-100 bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              {quiz.correctAnswer === option.label ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : null}
              <span>
                {option.label}. {option.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        {deleting ? "Menghapus..." : "Hapus Quiz"}
      </button>
    </article>
  );
}