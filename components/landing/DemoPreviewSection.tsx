'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

export default function DemoPreviewSection() {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || !mockupRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const mockup = mockupRef.current;

    const ctx = gsap.context(() => {
      // Content animation
      gsap.from(content, {
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: -40,
        duration: 0.8,
      });

      // Mockup animation with parallax
      gsap.from(mockup, {
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: 40,
        duration: 0.8,
      });

      gsap.to(mockup, {
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
        y: -20,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white via-emerald-50/30 to-white px-4 py-20 sm:px-6 md:py-32 lg:px-8 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div ref={contentRef} className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
              {t('landing.demo.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-300">
              {t('landing.demo.subtitle')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <span className="text-lg">📱</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('landing.demo.feature1.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {t('landing.demo.feature1.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <span className="text-lg">⚡</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('landing.demo.feature2.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {t('landing.demo.feature2.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <span className="text-lg">🏆</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('landing.demo.feature3.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {t('landing.demo.feature3.description')}
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-4 w-fit rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95">
              {t('landing.demo.cta')}
            </button>
          </div>

          {/* Demo Mockup */}
          <div ref={mockupRef} className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Background decoration */}
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-emerald-200 to-teal-200 opacity-20 blur-2xl dark:from-emerald-500/10 dark:to-teal-500/10" />

              {/* Mockup card */}
              <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 p-6 shadow-2xl dark:border-emerald-900/60 dark:from-slate-900 dark:to-slate-950">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Pilah Yuk!!</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {t('landing.demo.mockup.dashboard')}
                    </p>
                  </div>
                </div>

                {/* Upload section */}
                <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-white p-8 dark:border-emerald-700 dark:bg-slate-900">
                  <span className="text-5xl">📸</span>
                  <p className="text-center text-sm font-medium text-gray-600 dark:text-slate-300">
                    {t('landing.demo.mockup.uploadPrompt')}
                  </p>
                </div>

                {/* Result showcase */}
                <div className="space-y-4">
                  {/* Result card 1 */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {t('waste.plastic')}
                        </p>
                        <p className="text-xs font-semibold text-emerald-600">
                          {t('landing.mockup.accuracy', { value: 92 })}
                        </p>
                      </div>
                      <span className="text-2xl">🍾</span>
                    </div>
                    <p className="mb-3 text-xs text-gray-600 dark:text-slate-300">
                      {t('landing.demo.mockup.points')}: <span className="font-bold text-emerald-500">+10</span>
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-emerald-200 dark:bg-emerald-900/40">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-11/12" />
                    </div>
                  </div>

                  {/* Result card 2 */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {t('waste.paper')}
                        </p>
                        <p className="text-xs font-semibold text-blue-600">
                          {t('landing.mockup.accuracy', { value: 88 })}
                        </p>
                      </div>
                      <span className="text-2xl">📰</span>
                    </div>
                    <p className="mb-3 text-xs text-gray-600 dark:text-slate-300">
                      {t('landing.demo.mockup.points')}: <span className="font-bold text-blue-500">+8</span>
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-blue-200 dark:bg-blue-900/40">
                      <div className="bg-blue-500 h-1.5 rounded-full w-10/12" />
                    </div>
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="mt-6 flex justify-around border-t border-gray-200 pt-6 dark:border-slate-800">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-500">28</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {t('landing.demo.mockup.today')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">156</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {t('landing.demo.mockup.thisMonth')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
