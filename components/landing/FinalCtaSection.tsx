'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

type FinalCtaSectionProps = {
  readonly ctaLabel: string;
  readonly ctaHref: string;
};

export default function FinalCtaSection({ ctaLabel, ctaHref }: FinalCtaSectionProps) {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !sectionRef.current) return;

    const content = contentRef.current;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(
        content.querySelectorAll('[data-animate]'),
      );

      if (elements.length > 0) {
        gsap.from(elements, {
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div ref={contentRef} className="space-y-6">
            <div data-animate className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              <Sparkles className="h-4 w-4" />
              <span>Ready to launch</span>
            </div>

            <h2
              data-animate
              className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white"
            >
              {t('landing.final.title')}{' '}
              <span className="bg-linear-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
                {t('landing.final.titleAccent')}
              </span>
            </h2>

            <p data-animate className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
              {t('landing.final.subtitle')}
            </p>

            <div data-animate className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Trusted flow', text: 'No clutter, no friction' },
                { icon: Users, title: 'Community loop', text: 'Rank alongside peers' },
                { icon: Trophy, title: 'Impact rewards', text: 'Points that feel tangible' },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div data-animate className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/20 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-emerald-900/60 dark:hover:text-emerald-300"
              >
                {t('landing.final.secondaryCta')}
              </Link>
            </div>

            <div data-animate className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="inline-flex items-center gap-2">
                <CheckBadge />
                <span>{t('landing.final.trustUsers')}</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block dark:bg-slate-600" />
              <div className="inline-flex items-center gap-2">
                <CheckBadge />
                <span>{t('landing.final.trustRating')}</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block dark:bg-slate-600" />
              <div className="inline-flex items-center gap-2">
                <CheckBadge />
                <span>{t('landing.final.trustSecurity')}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-8 top-8 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
              <div className="absolute right-8 bottom-8 h-52 w-52 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 md:p-6">
              <div className="grid gap-4 rounded-[1.5rem] border border-emerald-100 bg-linear-to-br from-white via-emerald-50/60 to-white p-5 dark:border-emerald-900/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Quick start</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Start in under a minute</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <Leaf className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    'Open the dashboard or sign in.',
                    'Upload one image of sorted waste.',
                    'Get AI classification and rewards.',
                    'Track your rank and impact.'
                  ].map((text, index) => (
                    <div key={text} className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                          0{index + 1}
                        </div>
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'AI scan', value: '92%' },
                    { label: 'Points', value: '+10' },
                    { label: 'Rank gain', value: 'Live' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckBadge() {
  return <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />;
}
