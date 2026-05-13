"use client";

import { Leaf, Recycle, Sparkles, Trophy } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

const HIGHLIGHTS = [
  {
    id: "point",
    icon: Trophy,
    textKey: "auth.login.highlight.points",
  },
  {
    id: "ai",
    icon: Sparkles,
    textKey: "auth.login.highlight.ai",
  },
  {
    id: "impact",
    icon: Recycle,
    textKey: "auth.login.highlight.impact",
  },
] as const;

export default function LoginHeroText() {
  const { t } = useSettings();
  return (
    <aside className="hidden text-white/90 lg:block">
      <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-950/35 px-4 py-1.5 text-xs font-medium tracking-[0.12em] uppercase text-emerald-100">
        <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
        Pilah Yuk!!
      </p>

      <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-white">
        {t("auth.login.heroTitle")}
      </h2>

      <p className="mt-4 max-w-lg text-base leading-relaxed text-emerald-50/80">
        {t("auth.login.heroSubtitle")}
      </p>

      <ul className="mt-8 space-y-3">
        {HIGHLIGHTS.map((highlight) => {
          const Icon = highlight.icon;

          return (
            <li
              key={highlight.id}
              className="flex max-w-lg items-start gap-3 rounded-xl border border-emerald-300/20 bg-emerald-950/20 p-3"
            >
              <span className="mt-0.5 rounded-lg bg-emerald-300/15 p-2 text-emerald-100">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm leading-relaxed text-emerald-50/90">
                {t(highlight.textKey)}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
