'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSettings } from '@/hooks/use-settings';

export default function HeroSection() {
  const { t } = useSettings();
  const tagRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const floatingLeaf1Ref = useRef<HTMLDivElement>(null);
  const floatingLeaf2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate tag
      if (tagRef.current) {
        tl.from(tagRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
        }, 0);
      }

      // Animate title
      if (titleRef.current) {
        tl.from(titleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
        }, 0.1);
      }

      // Animate subtitle
      if (subtitleRef.current) {
        tl.from(subtitleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
        }, 0.2);
      }

      // Animate CTA buttons
      if (ctaContainerRef.current) {
        const buttons = ctaContainerRef.current.querySelectorAll('button, a');
        tl.from(buttons, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
        }, 0.3);
      }

      // Animate mockup
      if (mockupRef.current) {
        tl.from(mockupRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 40,
          duration: 1,
        }, 0);
      }

      // Animate stats
      if (statsRef.current) {
        const stats = statsRef.current.querySelectorAll('[data-stat]');
        tl.from(stats, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
        }, 0.4);
      }

      // Floating leaves animation
      if (floatingLeaf1Ref.current) {
        gsap.to(floatingLeaf1Ref.current, {
          y: -20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (floatingLeaf2Ref.current) {
        gsap.to(floatingLeaf2Ref.current, {
          y: -15,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-white px-4 pb-20 pt-28 sm:px-6 lg:px-8 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
    >
      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-200 opacity-10 blur-3xl mix-blend-multiply dark:bg-emerald-500/10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-200 opacity-10 blur-3xl mix-blend-multiply dark:bg-teal-500/10" />
      </div>

      {/* Floating leaves decoration */}
      <div ref={floatingLeaf1Ref} className="absolute top-32 left-12 text-6xl opacity-20 pointer-events-none">🍃</div>
      <div ref={floatingLeaf2Ref} className="absolute bottom-32 right-16 text-5xl opacity-15 pointer-events-none">🍃</div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Content */}
          <div className="flex flex-col gap-6 md:gap-8 pt-8 lg:pt-0">
            {/* Tag */}
            <div
              ref={tagRef}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-900/60 dark:bg-emerald-950/50"
            >
              <span className="text-xl">🌱</span>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-200">
                {t('landing.hero.tag')}
              </span>
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              className="text-5xl font-bold leading-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white"
            >
              {t('landing.hero.titleLine1')}
              <br />
              {t('landing.hero.titleLine2')}
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">
                {t('landing.hero.titleAccent')}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="max-w-xl text-base leading-relaxed text-gray-700 sm:text-lg dark:text-slate-200"
            >
              {t('landing.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div ref={ctaContainerRef} className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-95">
                {t('landing.hero.ctaPrimary')}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-600 px-8 py-3 text-base font-semibold text-emerald-600 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 active:scale-95 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-950/30">
                <span>▶</span> {t('landing.hero.ctaSecondary')}
              </button>
            </div>
          </div>

          {/* Right Side - App Mockup */}
          <div className="relative flex justify-center lg:justify-end pt-0 lg:pt-8">
            <div
              ref={mockupRef}
              className="relative w-full max-w-sm"
            >
              {/* Phone Mockup */}
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Status Bar */}
                <div className="flex h-8 items-center justify-between bg-white px-6 text-xs font-semibold text-gray-900 dark:bg-slate-900 dark:text-slate-100">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Notch */}
                <div className="flex h-6 items-center justify-center bg-black">
                  <div className="h-5 w-32 rounded-b-2xl bg-black" />
                </div>

                {/* App Content */}
                <div className="space-y-5 bg-white p-5 dark:bg-slate-900">
                  {/* App Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                        🗑️
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">Pilah Yuk!!</span>
                    </div>
                    <div className="flex gap-2 text-gray-600 dark:text-slate-300">
                      <span className="text-xl">🔔</span>
                      <span className="text-xl">👤</span>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-white p-6 dark:border-emerald-700 dark:bg-slate-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-xl text-white">
                      🗑️
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-700 dark:text-slate-200">
                        {t('landing.mockup.uploadTitle')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {t('landing.mockup.uploadHint')}
                      </p>
                    </div>
                  </div>

                  {/* Detection Result */}
                  <div className="space-y-3 rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                      {t('landing.mockup.resultTitle')}
                    </p>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {t('waste.plastic')}
                        </p>
                        <p className="text-xs font-semibold text-emerald-600">
                          {t('landing.mockup.accuracy', { value: 92 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                          {t('landing.mockup.points')}
                        </p>
                        <p className="text-lg font-bold text-emerald-600">+10</p>
                      </div>
                    </div>
                  </div>

                  {/* Category Icons */}
                  <div className="flex justify-between items-center gap-2 text-center">
                    {[
                      { icon: '🧴', label: t('waste.plastic') },
                      { icon: '📄', label: t('waste.paper') },
                      { icon: '🥛', label: t('waste.glass') },
                      { icon: '🔧', label: t('waste.metal') },
                      { icon: '🍂', label: t('waste.organic') },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="text-2xl">{item.icon}</div>
                        <p className="text-xs font-medium text-gray-600 dark:text-slate-300">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-around border-t border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  {[
                    { icon: '🏠', label: t('landing.mockup.nav.home') },
                    { icon: '📸', label: t('landing.mockup.nav.upload') },
                    { icon: '⊕', label: '' },
                    { icon: '🏆', label: t('landing.mockup.nav.leaderboard') },
                    { icon: '👤', label: t('landing.mockup.nav.account') },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="flex flex-col items-center gap-1 text-gray-600 transition-colors hover:text-emerald-600 dark:text-slate-300"
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label && (
                        <span className="text-xs font-medium">{item.label}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Badge with floating effect */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white transform hover:scale-110 transition-transform">
                AI
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-20 pt-12 border-t border-gray-200 dark:border-slate-800">
          {[
            { icon: '🗑️', number: '1.200+', label: t('landing.stats.item1.label') },
            { icon: '🧴', number: '850+', label: t('landing.stats.item2.label') },
            { icon: '👥', number: '320+', label: t('landing.stats.item3.label') },
            { icon: '🌍', number: '5', label: t('landing.stats.item4.label') },
          ].map((stat, i) => (
            <div key={i} data-stat className="text-center py-4">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</p>
              <p className="text-sm text-gray-600 mt-1 dark:text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
