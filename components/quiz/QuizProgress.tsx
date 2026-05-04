type QuizProgressProps = {
  current: number;
  total: number;
};

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="rounded-[1.5rem] border border-emerald-100 bg-white p-4 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)]">
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span className="text-slate-600">
          Progress {current}/{total}
        </span>
        <span className="text-emerald-700">{percentage}%</span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-emerald-50">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}