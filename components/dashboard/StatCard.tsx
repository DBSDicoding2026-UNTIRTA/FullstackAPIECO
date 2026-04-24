import type { DashboardStatItem } from "@/types";

interface StatCardProps {
  readonly item: DashboardStatItem;
}

const toneClassMap: Record<DashboardStatItem["tone"], string> = {
  emerald: "border-emerald-200 bg-emerald-50",
  sky: "border-sky-200 bg-sky-50",
  amber: "border-amber-200 bg-amber-50",
  violet: "border-violet-200 bg-violet-50",
};

export default function StatCard({ item }: StatCardProps) {
  return (
    <article className={`rounded-2xl border p-5 ${toneClassMap[item.tone]}`}>
      <p className="text-2xl" aria-hidden>
        {item.icon}
      </p>
      <p className="mt-2 text-xs text-slate-600">{item.label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{item.value}</p>
      <p className="mt-1 text-xs text-slate-500">{item.caption}</p>
    </article>
  );
}
