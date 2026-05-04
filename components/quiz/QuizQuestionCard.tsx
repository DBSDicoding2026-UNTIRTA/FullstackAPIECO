import { Loader2, Sparkles } from "lucide-react";

export type UserQuizQuestion = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  points: number;
};

type QuizQuestionCardProps = {
  quiz: UserQuizQuestion;
  selectedAnswer: string | null;
  answered: boolean;
  submitting: boolean;
  onSelect: (answer: string) => void;
  onSubmit: () => void;
};

export default function QuizQuestionCard({
  quiz,
  selectedAnswer,
  answered,
  submitting,
  onSelect,
  onSubmit,
}: QuizQuestionCardProps) {
  const options = [
    { label: "A", value: quiz.optionA },
    { label: "B", value: quiz.optionB },
    { label: "C", value: quiz.optionC },
    { label: "D", value: quiz.optionD },
  ];

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
            <Sparkles className="h-4 w-4" />
            +{quiz.points} XP
          </div>

          <h2 className="mt-5 text-2xl font-black leading-tight text-slate-900">
            {quiz.question}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.label;

          return (
            <button
              key={option.label}
              type="button"
              disabled={answered || submitting}
              onClick={() => onSelect(option.label)}
              className={`flex items-center gap-4 rounded-[1.25rem] border p-4 text-left transition ${
                isSelected
                  ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
              } disabled:cursor-not-allowed`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {option.label}
              </span>

              <span className="font-bold">{option.value}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selectedAnswer || answered || submitting}
        onClick={onSubmit}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Mengecek...
          </>
        ) : (
          "Cek Jawaban"
        )}
      </button>
    </section>
  );
}