import type { UserBadge } from "@/types";

interface BadgeCardProps {
  readonly badge: UserBadge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 text-center ${
        badge.unlocked
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50 opacity-70"
      }`}
    >
      <p className="text-2xl" aria-hidden>
        {badge.icon}
      </p>
      <h3 className="mt-2 text-sm font-semibold text-slate-900">{badge.name}</h3>
      <p className="mt-1 text-xs text-slate-600">{badge.description}</p>
    </article>
  );
}
