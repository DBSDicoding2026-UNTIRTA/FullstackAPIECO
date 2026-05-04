import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";

export type QuizModuleRecord = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  xpReward: number;
  questionCount: number;
};

type QuizModuleListProps = {
  modules: QuizModuleRecord[];
  onSelect: (moduleRecord: QuizModuleRecord) => void;
};

export default function QuizModuleList({ modules, onSelect }: QuizModuleListProps) {
  if (modules.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-emerald-200 bg-white p-10 text-center text-sm font-bold text-slate-500">
        Belum ada modul quiz yang aktif.
      </div>
    );
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            <BookOpenText className="h-4 w-4" />
            Pilih Modul
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
            Mulai dari modul yang kamu pilih
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Satu modul berisi kumpulan pertanyaan yang relevan. Kerjakan satu per satu untuk menyelesaikan progress modul tersebut.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 px-4 py-3 text-right text-amber-800">
          <div className="flex items-center justify-end gap-2 text-sm font-bold">
            <Sparkles className="h-4 w-4" />
            Bonus XP
          </div>
          <p className="mt-1 text-xs text-amber-700">Per modul jika tersedia</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((moduleRecord) => (
          <article
            key={moduleRecord.id}
            className="group flex h-full flex-col justify-between rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/80 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-30px_rgba(16,185,129,0.45)]"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                  Modul {moduleRecord.order}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  {moduleRecord.questionCount} soal
                </span>
              </div>

              <h3 className="mt-4 text-xl font-black tracking-tight text-slate-900">
                {moduleRecord.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                {moduleRecord.description ?? "Tidak ada deskripsi modul."}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-yellow-100 px-4 py-3 text-yellow-800">
                <p className="text-[11px] font-black uppercase tracking-[0.18em]">
                  Bonus XP
                </p>
                <p className="mt-1 text-lg font-black">+{moduleRecord.xpReward}</p>
              </div>

              <button
                type="button"
                onClick={() => onSelect(moduleRecord)}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                Mulai
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}