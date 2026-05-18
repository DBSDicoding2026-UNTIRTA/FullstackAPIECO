'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Trophy } from 'lucide-react';
import { leaderboardUsers } from '@/data/landing';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

export default function LeaderboardPreview() {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    const container = containerRef.current;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll('[data-rank]'),
      );

      if (rows.length > 0) {
        gsap.from(rows, {
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          x: -30,
          stagger: 0.1,
          duration: 0.6,
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="leaderboard"
      className="bg-white px-4 py-20 sm:px-6 md:py-32 lg:px-8 dark:bg-slate-950"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            {t('landing.leaderboard.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            {t('landing.leaderboard.subtitle')}
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 px-6 py-6 md:px-8">
            <h3 className="text-xl font-bold text-white">{t('landing.leaderboard.cardTitle')}</h3>
            <p className="mt-1 text-sm text-emerald-100">
              {t('landing.leaderboard.cardSubtitle')}
            </p>
          </div>

          {/* Leaderboard table */}
          <div ref={containerRef} className="divide-y divide-gray-200 dark:divide-slate-800">
            {leaderboardUsers.map((user) => (
              <div
                key={user.id}
                data-rank={user.rank}
                className="px-6 py-4 transition-colors duration-200 hover:bg-emerald-50/50 md:px-8 dark:hover:bg-emerald-950/20"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Rank and info */}
                  <div className="flex flex-1 items-center gap-4">
                    {/* Rank badge */}
                    <div className="relative h-12 w-12 shrink-0">
                      {user.rank === 1 && (
                        <div className="absolute inset-0 animate-pulse bg-yellow-300 rounded-full blur-md opacity-50" />
                      )}
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                          user.rank === 1
                            ? 'bg-linear-to-br from-yellow-400 to-yellow-500'
                            : user.rank === 2
                              ? 'bg-linear-to-br from-gray-400 to-gray-500'
                              : 'bg-linear-to-br from-orange-400 to-orange-500'
                        }`}
                      >
                        {user.rank === 1 ? <Trophy className="h-5 w-5" /> : `#${user.rank}`}
                      </div>
                    </div>

                    {/* User info */}
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-200 to-teal-200 text-sm font-semibold text-emerald-800 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-200">
                        {user.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {user.rank === 1
                            ? t('landing.leaderboard.rank.top')
                            : user.rank === 2
                              ? t('landing.leaderboard.rank.rising')
                              : t('landing.leaderboard.rank.great')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600">{user.points}</span>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {t('landing.leaderboard.pointsUnit')}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 ml-16 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500"
                    style={{ width: `${(user.points / 3250) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between bg-gray-50 px-6 py-4 md:px-8 dark:bg-slate-900">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {t('landing.leaderboard.footerText')}
            </p>
            <button className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
              {t('landing.leaderboard.footerCta')}
            </button>
          </div>
        </div>

        {/* Fun fact */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
            <BarChart3 className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
              {t('landing.leaderboard.funFact')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
