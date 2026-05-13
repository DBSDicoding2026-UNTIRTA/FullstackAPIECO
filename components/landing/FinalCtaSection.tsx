'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCtaSection() {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !sectionRef.current) return;

    const content = contentRef.current;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const elements = content.querySelectorAll('[data-animate]');

      gsap.from(elements, {
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="bg-gradient-to-b from-white to-emerald-50 px-4 py-20 sm:px-6 md:py-32 lg:px-8 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 h-64 w-64 animate-pulse rounded-full bg-emerald-200 opacity-20 blur-3xl mix-blend-multiply dark:bg-emerald-500/10" />
          <div className="absolute bottom-10 right-1/4 h-64 w-64 animate-pulse rounded-full bg-teal-200 opacity-20 blur-3xl mix-blend-multiply dark:bg-teal-500/10" />
        </div>

        <div ref={contentRef} className="relative z-10">
          {/* Floating icons animation container */}
          <div className="mb-8 md:mb-12 flex justify-center gap-4 flex-wrap">
            {['♻️', '🌍', '🌱'].map((icon, idx) => (
              <div
                key={icon}
                data-animate=""
                className="text-3xl md:text-4xl animate-bounce"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Content */}
          <h2
            data-animate=""
            className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
          >
            {t('landing.final.title')}{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              {t('landing.final.titleAccent')}
            </span>
          </h2>

          <p
            data-animate=""
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-slate-300"
          >
            {t('landing.final.subtitle')}
          </p>

          {/* Benefits */}
          <div
            data-animate=""
            className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md md:p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-3xl md:text-4xl mb-3 block">🎁</span>
              <p className="mb-1 font-semibold text-gray-900 dark:text-white">
                {t('landing.final.benefit1.title')}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {t('landing.final.benefit1.description')}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md md:p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-3xl md:text-4xl mb-3 block">⚡</span>
              <p className="mb-1 font-semibold text-gray-900 dark:text-white">
                {t('landing.final.benefit2.title')}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {t('landing.final.benefit2.description')}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md md:p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-3xl md:text-4xl mb-3 block">🌟</span>
              <p className="mb-1 font-semibold text-gray-900 dark:text-white">
                {t('landing.final.benefit3.title')}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {t('landing.final.benefit3.description')}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            data-animate=""
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95 md:px-10">
              {t('auth.googleContinue')}
            </button>
            <button className="rounded-xl border-2 border-emerald-500 px-8 py-4 text-lg font-semibold text-emerald-600 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 active:scale-95 md:px-10 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-950/30">
              {t('landing.final.secondaryCta')}
            </button>
          </div>

          {/* Trust badge */}
          <div
            data-animate=""
            className="mt-12 flex flex-col items-center justify-center gap-6 text-sm text-gray-600 sm:flex-row dark:text-slate-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <p>{t('landing.final.trustUsers')}</p>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <p>{t('landing.final.trustRating')}</p>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <p>{t('landing.final.trustSecurity')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
