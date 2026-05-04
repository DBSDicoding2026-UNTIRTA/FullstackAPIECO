import Link from "next/link";
import { ArrowLeft, Award, CheckCircle2, Home, XCircle } from "lucide-react";

type QuizSummaryProps = {
  moduleTitle: string;
  correctCount: number;
  wrongCount: number;
  totalXp: number;
  level: number | null;
  totalPoints: number | null;
  onBackToModules: () => void;
};

export default function QuizSummary({
  moduleTitle,
  correctCount,
  wrongCount,
  totalXp,
  level,
  totalPoints,
  onBackToModules,
}: QuizSummaryProps) {
  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-8 text-center shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)]">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
        <Award className="h-10 w-10" />
      </div>

      <h2 className="mt-5 text-3xl font-black">Quiz Selesai!</h2>
      <p className="mt-2 text-sm font-semibold text-emerald-700">
        Modul: {moduleTitle}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        XP yang kamu dapat sudah tersimpan di database.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle2 className="mx-auto h-6 w-6" />
          <p className="mt-2 text-2xl font-black">{correctCount}</p>
          <p className="text-xs font-bold uppercase">Benar</p>
        </div>

        <div className="rounded-2xl bg-rose-50 p-4 text-rose-700">
          <XCircle className="mx-auto h-6 w-6" />
          <p className="mt-2 text-2xl font-black">{wrongCount}</p>
          <p className="text-xs font-bold uppercase">Salah</p>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-4 text-yellow-700">
          <Award className="mx-auto h-6 w-6" />
          <p className="mt-2 text-2xl font-black">+{totalXp}</p>
          <p className="text-xs font-bold uppercase">XP</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-[#f8fffb] p-4">
        <p className="text-sm font-bold text-slate-600">
          Total Point: {totalPoints ?? "-"}
        </p>
        <p className="mt-1 text-sm font-bold text-emerald-700">
          Level: {level ?? "-"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onBackToModules}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Modul
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-white px-6 py-3 font-black text-emerald-700 transition hover:bg-emerald-50"
        >
          <Home className="h-5 w-5" />
          Ke Dashboard
        </Link>
      </div>
    </section>
  );
}