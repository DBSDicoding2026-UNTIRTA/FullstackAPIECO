"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Leaf, Recycle, Sparkles, Trophy } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

const HIGHLIGHTS = [
  {
    id: "ai",
    icon: Sparkles,
    textKey: "auth.register.highlight.ai",
  },
  {
    id: "points",
    icon: Trophy,
    textKey: "auth.register.highlight.points",
  },
  {
    id: "badge-leaderboard",
    icon: Recycle,
    textKey: "auth.register.highlight.badge",
  },
] as const;

export default function RegisterHeroText() {
  const { t } = useSettings();
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      if (!heroRef.current) return;

      const heroItems = gsap.utils.toArray<HTMLElement>(
        heroRef.current.querySelectorAll("[data-hero-item]"),
      );

      if (heroItems.length > 0) {
        gsap.from(heroItems, {
          y: 18,
          opacity: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power2.out",
        });
      }
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <aside ref={heroRef} className="text-white/90">
      <p
        data-hero-item
        className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-950/35 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-100 sm:text-xs"
      >
        <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
        {t("auth.register.heroTag")}
      </p>

      <h1 data-hero-item className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {t("auth.register.heroTitle")}
      </h1>

      <p data-hero-item className="mt-4 max-w-xl text-sm leading-relaxed text-emerald-50/85 sm:text-base">
        {t("auth.register.heroSubtitle")}
      </p>

      <ul data-hero-item className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {HIGHLIGHTS.map((highlight) => {
          const Icon = highlight.icon;

          return (
            <li
              key={highlight.id}
              className="flex items-center gap-3 rounded-xl border border-emerald-300/20 bg-emerald-950/25 p-3"
            >
              <span className="inline-flex rounded-lg bg-emerald-300/15 p-2 text-emerald-100">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm text-emerald-50/90">
                {t(highlight.textKey)}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
