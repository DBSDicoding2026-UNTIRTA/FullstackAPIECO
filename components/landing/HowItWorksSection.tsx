'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { howItWorksSteps } from '@/data/landing';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
  const { t } = useSettings();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    const container = containerRef.current;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll('[data-step]');

      gsap.to(cards, {
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'center 30%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="bg-white px-4 py-20 sm:px-6 md:py-32 lg:px-8 dark:bg-slate-950"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            {t('landing.how.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg dark:text-slate-300">
            {t('landing.how.subtitle')}
          </p>
        </div>

        {/* Steps Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {howItWorksSteps.map((step) => (
            <div
              key={step.id}
              data-step={step.id}
              className="opacity-0 translate-y-8 flex flex-col items-center text-center relative"
            >
              {/* Connector line for desktop */}
              {step.id < 4 && (
                <div className="hidden lg:block absolute top-12 -right-8 w-16 h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
              )}

              {/* Step number badge */}
              <div className="relative mb-6 z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">{step.id}</span>
                </div>
              </div>

              {/* Icon */}
              <div className="text-6xl mb-4">{step.icon}</div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t(step.titleKey)}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                {t(step.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
