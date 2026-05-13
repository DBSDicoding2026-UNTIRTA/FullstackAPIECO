import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

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
  const { t } = useSettings();
  if (modules.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-emerald-200 bg-white p-10 text-center text-sm font-bold text-slate-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-300">
        {t("quiz.modules.empty")}
      </div>
    );
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <BookOpenText className="h-4 w-4" />
            {t("quiz.modules.badge")}
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("quiz.modules.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t("quiz.modules.subtitle")}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 px-4 py-3 text-right text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <div className="flex items-center justify-end gap-2 text-sm font-bold">
            <Sparkles className="h-4 w-4" />
            {t("quiz.modules.bonus")}
          </div>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
            {t("quiz.modules.bonusHint")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((moduleRecord) => (
          <article
            key={moduleRecord.id}
            className="group flex h-full flex-col justify-between rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/80 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-30px_rgba(16,185,129,0.45)] dark:border-emerald-900/60 dark:from-slate-900 dark:to-slate-950"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {t("quiz.modules.moduleLabel", { order: moduleRecord.order })}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  {t("quiz.modules.questionCount", { count: moduleRecord.questionCount })}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {moduleRecord.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {moduleRecord.description ?? t("quiz.modules.noDescription")}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-yellow-100 px-4 py-3 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                <p className="text-[11px] font-black uppercase tracking-[0.18em]">
                  {t("quiz.modules.bonus")}
                </p>
                <p className="mt-1 text-lg font-black">+{moduleRecord.xpReward}</p>
              </div>

              <button
                type="button"
                onClick={() => onSelect(moduleRecord)}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                {t("quiz.modules.start")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}