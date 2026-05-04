"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BookOpenText, Loader2, PlusCircle } from "lucide-react";

import type { AdminQuizAnswer, AdminQuizModule } from "./types";

const refreshEventName = "admin-quiz:changed";

export default function QuizForm() {
  const router = useRouter();

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

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === moduleId) ?? null,
    [moduleId, modules]
  );

  useEffect(() => {
    let active = true;

    async function loadModules() {
      const res = await fetch("/api/admin/quiz/modules", {
        cache: "no-store",
      });

      if (!res.ok) return;

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
    }

    void loadModules();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!moduleId) {
      alert("Pilih modul terlebih dahulu.");
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

        alert(payload?.message ?? "Gagal membuat quiz.");
        return;
      }

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("A");
      setPoints(10);

      window.dispatchEvent(new Event(refreshEventName));
      router.refresh();
    } catch {
      alert("Gagal membuat quiz.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)]"
    >
      <div className="flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-emerald-600" />
        <h2 className="text-xl font-black tracking-tight">Buat Quiz</h2>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        Buat pertanyaan berdasarkan modul yang dipilih.
      </p>

      <div className="mt-5">
        <label className="text-sm font-bold text-slate-700">Modul</label>
        <select
          value={moduleId}
          onChange={(event) => setModuleId(event.target.value)}
          required
          disabled={modules.length === 0}
          className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          {modules.length === 0 ? (
            <option value="">Belum ada modul</option>
          ) : (
            modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))
          )}
        </select>
      </div>

      {selectedModule ? (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
              <BookOpenText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                Modul Terpilih
              </p>

              <h3 className="mt-1 text-base font-black text-slate-900">
                Modul {selectedModule.order}: {selectedModule.title}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {selectedModule.description ?? "Belum ada deskripsi modul."}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                  XP Reward: {selectedModule.xpReward}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                  Jumlah Soal: {selectedModule.questionCount}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                  Status: {selectedModule.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5">
        <label className="text-sm font-bold text-slate-700">Pertanyaan</label>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          required
          placeholder="Contoh: Botol plastik termasuk sampah apa?"
          className="mt-2 min-h-28 w-full rounded-2xl border border-emerald-100 p-4 text-sm outline-none focus:border-emerald-500"
        />
      </div>

      <div className="mt-5 grid gap-3">
        <input
          value={optionA}
          onChange={(event) => setOptionA(event.target.value)}
          required
          placeholder="Pilihan A"
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
        />

        <input
          value={optionB}
          onChange={(event) => setOptionB(event.target.value)}
          required
          placeholder="Pilihan B"
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
        />

        <input
          value={optionC}
          onChange={(event) => setOptionC(event.target.value)}
          required
          placeholder="Pilihan C"
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
        />

        <input
          value={optionD}
          onChange={(event) => setOptionD(event.target.value)}
          required
          placeholder="Pilihan D"
          className="rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-bold text-slate-700">
            Jawaban Benar
          </label>
          <select
            value={correctAnswer}
            onChange={(event) =>
              setCorrectAnswer(event.target.value as AdminQuizAnswer)
            }
            className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">XP</label>
          <input
            type="number"
            min={1}
            value={points}
            onChange={(event) => setPoints(Number(event.target.value))}
            required
            className="mt-2 w-full rounded-2xl border border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || modules.length === 0}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Quiz"
        )}
      </button>
    </form>
  );
}