'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Leaf,
  ShieldCheck,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

type HeroSectionProps = {
  readonly ctaLabel: string;
  readonly ctaHref: string;
};

export default function HeroSection({ ctaLabel, ctaHref }: HeroSectionProps) {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('[data-hero-animate]');

      gsap.from(items ?? [], {
        opacity: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featureItems = [
    { icon: ShieldCheck, label: 'Secure flow' },
    { icon: Bot, label: 'AI classification' },
    { icon: Users, label: 'Community ranking' },
  ];

  const statsItems = [
    {
      value: '1.2k+',
      label: t('landing.stats.item1.label'),
      icon: BarChart3,
    },
    {
      value: '850+',
      label: t('landing.stats.item2.label'),
      icon: Trophy,
    },
    {
      value: '320+',
      label: t('landing.stats.item3.label'),
      icon: TrendingUp,
    },
  ];

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-7">
          <div
            data-hero-animate
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <Leaf className="h-4 w-4" />
            <span>{t('landing.hero.tag')}</span>
          </div>

          <div className="space-y-5">
            <h1
              data-hero-animate
              className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white"
            >
              {t('landing.hero.titleLine1')}
              <br />
              {t('landing.hero.titleLine2')}
              <br />
              <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
                {t('landing.hero.titleAccent')}
              </span>
            </h1>

            <p
              data-hero-animate
              className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300"
            >
              {t('landing.hero.subtitle')}
            </p>
          </div>

          <div data-hero-animate className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
            >
              {t('landing.hero.ctaSecondary')}
            </Link>
          </div>

          <div data-hero-animate className="grid w-full gap-3 sm:grid-cols-3">
            {featureItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div data-hero-animate className="grid w-full gap-3 sm:grid-cols-3">
            {statsItems.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)] backdrop-blur dark:border-emerald-900/30 dark:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}