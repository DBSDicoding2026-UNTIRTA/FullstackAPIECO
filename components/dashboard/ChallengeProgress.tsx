import type { ChallengeItem } from "@/types";

interface ChallengeProgressProps {
  readonly items: ReadonlyArray<ChallengeItem>;
}

function getProgressPercentage(current: number, target: number): number {
  const percentage = Math.round((current / target) * 100);
  return Math.min(100, percentage);
}

export default function ChallengeProgress({ items }: ChallengeProgressProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Challenge Mingguan</h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => {
          const progress = getProgressPercentage(item.current, item.target);

          return (
            <li key={item.id}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-slate-700">
                  <span className="mr-1" aria-hidden>
                    {item.icon}
                  </span>
                  {item.title}
                </p>
                <p className="text-xs font-semibold text-emerald-700">{progress}%</p>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-emerald-600 to-lime-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
