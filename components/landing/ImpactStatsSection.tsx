'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Leaf, Recycle, Users } from 'lucide-react';
import { impactStats } from '@/data/landing';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  target: number;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const CountUp = ({ target, triggerRef }: CountUpProps) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!textRef.current || !trigger) return;

    const obj = { value: 0 };

    gsap.to(obj, {
      scrollTrigger: {
        trigger,
        start: 'top center',
        once: true,
      },
      value: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (textRef.current) {
          textRef.current.textContent = Math.floor(obj.value).toString();
        }
      },
    });
  }, [target, triggerRef]);

  return <span ref={textRef}>0</span>;
};

export default function ImpactStatsSection() {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="bg-linear-to-b from-white to-purple-50/30 px-4 py-20 sm:px-6 md:py-32 lg:px-8 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            {t('landing.stats.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-slate-300">
            {t('landing.stats.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {impactStats.map((stat, index) => {
            const Icon = [Recycle, Leaf, Users, BarChart3][index] ?? BarChart3;

            return (
            <div
              key={stat.id}
              className="group relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 opacity-0 bg-linear-to-br ${stat.color} transition-opacity duration-300 group-hover:opacity-5`}
              />

              {/* Icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                <Icon className="h-6 w-6" />
              </div>

              {/* Number and label */}
              <div className="relative z-10">
                <div className="mb-2">
                  <span className={`text-4xl sm:text-5xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                    <CountUp target={stat.value} triggerRef={sectionRef} />
                  </span>
                  <span className="ml-1 text-2xl font-bold text-gray-600 dark:text-slate-300">
                    {stat.suffix}
                  </span>
                </div>
                <p className="font-medium text-gray-600 dark:text-slate-300">
                  {t(stat.labelKey)}
                </p>
              </div>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${stat.color} transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100`} />
            </div>
            );
          })}
        </div>

        {/* Bottom message */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-lg text-gray-600 dark:text-slate-300">
            {t('landing.stats.footerMessage')}
          </p>
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
            <Recycle className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
              {t('landing.stats.joinCommunity')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
