"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CircleAlert, Loader2, PlusCircle, Sparkles } from "lucide-react";

const optionKeys = ["A", "B", "C", "D"] as const;

type OptionKey = (typeof optionKeys)[number];

type StatusState = {
  kind: "idle" | "success" | "error";
  message: string;
};

export default function QuizForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<OptionKey>("A");
  const [points, setPoints] = useState("10");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    kind: "idle",
    message: "",
  });

  function resetForm() {
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("A");
    setPoints("10");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedOptionA = optionA.trim();
    const trimmedOptionB = optionB.trim();
    const trimmedOptionC = optionC.trim();
    const trimmedOptionD = optionD.trim();
    const parsedPoints = Number.parseInt(points, 10);

    if (
      !trimmedQuestion ||
      !trimmedOptionA ||
      !trimmedOptionB ||
      !trimmedOptionC ||
      !trimmedOptionD
    ) {
      setStatus({
        kind: "error",
        message: "Semua field pertanyaan dan opsi harus diisi.",
      });
      return;
    }

    if (!Number.isInteger(parsedPoints) || parsedPoints < 1) {
      setStatus({
        kind: "error",
        message: "Poin harus berupa angka minimal 1.",
      });
      return;
    }

    setLoading(true);
    setStatus({ kind: "idle", message: "" });

    try {
      const res = await fetch("/api/admin/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          optionA: trimmedOptionA,
          optionB: trimmedOptionB,
          optionC: trimmedOptionC,
          optionD: trimmedOptionD,
          correctAnswer,
          points: parsedPoints,
        }),
      });

      const payload = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!res.ok) {
        setStatus({
          kind: "error",
          message: payload?.message ?? "Gagal membuat quiz.",
        });
        return;
      }

      resetForm();
      setStatus({
        kind: "success",
        message: "Quiz berhasil disimpan.",
      });
      window.dispatchEvent(new CustomEvent("admin-quiz:changed"));
      router.refresh();
    } catch {
      setStatus({
        kind: "error",
        message: "Terjadi gangguan saat menyimpan quiz.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)]"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <PlusCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight">Buat Pertanyaan</h2>
          <p className="mt-1 text-sm text-slate-500">
            Model seperti Duolingo: singkat, interaktif, dan berbasis poin.
          </p>
        </div>
      </div>

      {status.kind !== "idle" ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            status.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {status.kind === "success" ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <CircleAlert className="h-4 w-4" />
            )}
            {status.message}
          </div>
        </div>
      ) : null}

      <div className="mt-5">
        <label htmlFor="quiz-question" className="text-sm font-semibold">
          Pertanyaan
        </label>
        <textarea
          id="quiz-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Contoh: Botol plastik termasuk jenis sampah apa?"
          className="mt-2 min-h-28 w-full rounded-2xl border border-emerald-100 p-4 text-sm outline-none transition focus:border-emerald-500"
        />
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <label htmlFor="option-a" className="text-sm font-semibold">
            Pilihan A
          </label>
          <input
            id="option-a"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            placeholder="Masukkan pilihan A"
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="option-b" className="text-sm font-semibold">
            Pilihan B
          </label>
          <input
            id="option-b"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            placeholder="Masukkan pilihan B"
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="option-c" className="text-sm font-semibold">
            Pilihan C
          </label>
          <input
            id="option-c"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            placeholder="Masukkan pilihan C"
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="option-d" className="text-sm font-semibold">
            Pilihan D
          </label>
          <input
            id="option-d"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            placeholder="Masukkan pilihan D"
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="correct-answer" className="text-sm font-semibold">
            Jawaban Benar
          </label>
          <select
            id="correct-answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value as OptionKey)}
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none transition focus:border-emerald-500"
          >
            {optionKeys.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="points" className="text-sm font-semibold">
            Poin XP
          </label>
          <input
            id="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min={1}
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Menyimpan..." : "Simpan Quiz"}
      </button>
    </form>
  );
}