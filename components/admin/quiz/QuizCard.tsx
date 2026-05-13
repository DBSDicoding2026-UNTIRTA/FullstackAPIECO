"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Edit3, Loader2, Save, Trash2, X } from "lucide-react";

import type { AdminQuizAnswer, AdminQuizModule, AdminQuizRecord } from "./types";
import { quizChangedEventName } from "./events";
import ModuleCombobox from "./ModuleCombobox";

const answerOptions: AdminQuizAnswer[] = ["A", "B", "C", "D"];

type QuizCardProps = {
  index: number;
  quiz: AdminQuizRecord;
  modules: AdminQuizModule[];
};

export default function QuizCard({ quiz, index, modules }: QuizCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [moduleId, setModuleId] = useState(quiz.moduleId);
  const [question, setQuestion] = useState(quiz.question);
  const [optionA, setOptionA] = useState(quiz.optionA);
  const [optionB, setOptionB] = useState(quiz.optionB);
  const [optionC, setOptionC] = useState(quiz.optionC);
  const [optionD, setOptionD] = useState(quiz.optionD);
  const [correctAnswer, setCorrectAnswer] = useState<AdminQuizAnswer>(quiz.correctAnswer);
  const [points, setPoints] = useState(quiz.points);

  function handleStartEdit() {
    setError(null);
    setEditing(true);
    setModuleId(quiz.moduleId);
    setQuestion(quiz.question);
    setOptionA(quiz.optionA);
    setOptionB(quiz.optionB);
    setOptionC(quiz.optionC);
    setOptionD(quiz.optionD);
    setCorrectAnswer(quiz.correctAnswer);
    setPoints(quiz.points);
  }

  function handleCancelEdit() {
    setEditing(false);
    setError(null);
    setModuleId(quiz.moduleId);
    setQuestion(quiz.question);
    setOptionA(quiz.optionA);
    setOptionB(quiz.optionB);
    setOptionC(quiz.optionC);
    setOptionD(quiz.optionD);
    setCorrectAnswer(quiz.correctAnswer);
    setPoints(quiz.points);
  }

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

      window.dispatchEvent(new Event(quizChangedEventName));
      router.refresh();
    } catch {
      setError("Terjadi gangguan saat menghapus quiz.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave() {
    if (!moduleId) {
      setError("Pilih modul terlebih dahulu.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/quiz/${quiz.id}`, {
        method: "PATCH",
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

      const payload = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!res.ok) {
        setError(payload?.message ?? "Gagal menyimpan perubahan quiz.");
        return;
      }

      setEditing(false);
      window.dispatchEvent(new Event(quizChangedEventName));
      router.refresh();
    } catch {
      setError("Terjadi gangguan saat menyimpan quiz.");
    } finally {
      setSaving(false);
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Level {index + 1}
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
              {quiz.module.title}
            </span>
          </div>

          <h3 className="mt-3 font-bold text-slate-900">{quiz.question}</h3>
          <p className="mt-2 text-xs text-slate-500">
            {quiz.module.title} - Urutan {quiz.module.order}
          </p>
        </div>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
          +{quiz.points} XP
        </span>
      </div>

      {editing ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-emerald-100 bg-white p-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Modul
            </label>
            <ModuleCombobox
              modules={modules}
              value={moduleId}
              onValueChange={setModuleId}
              disabled={modules.length === 0}
              placeholder="Pilih modul"
              searchPlaceholder="Cari modul..."
              emptyText="Modul tidak ditemukan."
              loadingText="Memuat modul..."
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Pertanyaan
            </label>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="mt-2 min-h-24 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={optionA}
              onChange={(event) => setOptionA(event.target.value)}
              placeholder="Pilihan A"
              className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={optionB}
              onChange={(event) => setOptionB(event.target.value)}
              placeholder="Pilihan B"
              className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={optionC}
              onChange={(event) => setOptionC(event.target.value)}
              placeholder="Pilihan C"
              className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
            />
            <input
              value={optionD}
              onChange={(event) => setOptionD(event.target.value)}
              placeholder="Pilihan D"
              className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Jawaban Benar
              </label>
              <select
                value={correctAnswer}
                onChange={(event) => setCorrectAnswer(event.target.value as AdminQuizAnswer)}
                className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500"
              >
                {answerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                XP
              </label>
              <input
                type="number"
                min={1}
                value={points}
                onChange={(event) => setPoints(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
              Batal
            </button>
          </div>
        </div>
      ) : (
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
      )}

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={editing ? handleCancelEdit : handleStartEdit}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          <Edit3 className="h-4 w-4" />
          {editing ? "Tutup Edit" : "Edit Quiz"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {deleting ? "Menghapus..." : "Hapus Quiz"}
        </button>
      </div>
    </article>
  );
}
