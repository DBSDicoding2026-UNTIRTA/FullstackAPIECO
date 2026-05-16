import { CheckCircle2, XCircle } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

type QuizResultPanelProps = {
  isCorrect: boolean;
  correctAnswer: string;
  pointsEarned: number;
  moduleBonusEarned: number;
  moduleCompleted: boolean;
};

export default function QuizResultPanel({
  isCorrect,
  correctAnswer,
  pointsEarned,
  moduleBonusEarned,
  moduleCompleted,
}: QuizResultPanelProps) {
  const { t } = useSettings();
  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        isCorrect
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
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
            {isCorrect
              ? t("quiz.result.correct", { points: pointsEarned })
              : t("quiz.result.wrong")}
          </h3>
          <p className="text-sm font-semibold">
            {t("quiz.result.correctAnswer", { answer: correctAnswer })}
          </p>
          {moduleBonusEarned > 0 ? (
            <p className="mt-1 text-sm font-black">
              {t("quiz.result.moduleBonus", { points: moduleBonusEarned })}
            </p>
          ) : moduleCompleted && isCorrect && pointsEarned === 0 ? (
            <p className="mt-1 text-sm font-semibold">
              {t("quiz.result.alreadyCompleted")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
