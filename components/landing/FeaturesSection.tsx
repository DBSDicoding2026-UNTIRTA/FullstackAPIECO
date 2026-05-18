'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { features } from '@/data/landing';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    const container = containerRef.current;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll('[data-feature]'),
      );

      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'center 20%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 40,
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
      id="features"
      className="bg-gradient-to-b from-white to-emerald-50/30 px-4 py-20 sm:px-6 md:py-32 lg:px-8 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            {t('landing.features.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-slate-300">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              data-feature={feature.id}
              className="group relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl md:p-8 dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${feature.color} transition-opacity duration-300 -z-10`}
              />

              {/* Icon */}
              <div className="text-5xl mb-4 inline-block">{feature.icon}</div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white">
                {t(feature.titleKey)}
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-slate-300">
                {t(feature.descriptionKey)}
              </p>

              {/* Bottom accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
