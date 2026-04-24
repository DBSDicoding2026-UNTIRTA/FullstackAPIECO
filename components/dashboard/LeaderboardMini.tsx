import type { LeaderboardEntry } from "@/types";

interface LeaderboardMiniProps {
  readonly entries: ReadonlyArray<LeaderboardEntry>;
}

export default function LeaderboardMini({ entries }: LeaderboardMiniProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Leaderboard Mini</h2>
      <ol className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
              entry.isCurrentUser ? "border-emerald-300 bg-emerald-50" : "border-slate-100"
            }`}
          >
            <p className="text-sm text-slate-700">
              #{entry.rank} {entry.name}
            </p>
            <p className="text-sm font-semibold text-slate-900">{entry.points}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
