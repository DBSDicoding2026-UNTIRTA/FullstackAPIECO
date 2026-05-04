import { CheckCircle2, XCircle } from "lucide-react";

type QuizResultPanelProps = {
  isCorrect: boolean;
  correctAnswer: string;
  pointsEarned: number;
};

export default function QuizResultPanel({
  isCorrect,
  correctAnswer,
  pointsEarned,
}: QuizResultPanelProps) {
  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        isCorrect
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
    >
      <div className="flex items-center gap-3">
        {isCorrect ? (
          <CheckCircle2 className="h-6 w-6" />
        ) : (
          <XCircle className="h-6 w-6" />
        )}

        <div>
          <h3 className="text-lg font-black">
            {isCorrect ? `Benar! +${pointsEarned} XP` : "Salah"}
          </h3>
          <p className="text-sm font-semibold">
            Jawaban benar: {correctAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}