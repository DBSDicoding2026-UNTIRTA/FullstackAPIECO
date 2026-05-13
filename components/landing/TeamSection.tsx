"use client";

import Image from 'next/image';
import React, { JSX, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { teamData } from '@/data/team';
import { useSettings } from '@/hooks/use-settings';

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection(): JSX.Element {
  const { t } = useSettings();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // entrance animation: fade-up stagger for cards and slight avatar scale
      const cards = Array.from(containerRef.current!.querySelectorAll<HTMLElement>('.team-card'));
      const avatars = Array.from(containerRef.current!.querySelectorAll<HTMLElement>('.team-avatar'));

      if (cards.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        tl.from(cards, {
          y: 20,
          opacity: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
        }).from(
          avatars,
          {
            scale: 0.98,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.12,
          },
          0
        );
      }

      // start ticker animation (continuous)
      tweenRef.current = gsap.to(trackRef.current, {
        x: '-50%',
        duration: 20,
        ease: 'linear',
        repeat: -1,
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, []);

  const handleMouseEnter = (): void => {
    tweenRef.current?.pause();
  };

  const handleMouseLeave = (): void => {
    tweenRef.current?.play();
  };

  const renderCardElement = (member: (typeof teamData)[number]) => (
    <article
      className="team-card min-w-[220px] flex-shrink-0 rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-emerald-900/60 dark:bg-slate-900"
      aria-label={member.name}
    >
      <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          {member.image && !member.isPlaceholder ? (
            <Image
              src={member.image}
              alt={member.name}
              width={96}
              height={96}
              className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 20c0-2.21 3.582-4 6-4s6 1.79 6 4" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-base font-medium text-emerald-900 dark:text-emerald-100">{member.name}</h3>
      <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-300">{member.role}</p>
    </article>
  );

  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto py-16 px-6 sm:px-8 lg:px-12">
        <div className="rounded-3xl bg-gradient-to-b from-emerald-50 to-white p-8 dark:from-emerald-950/40 dark:to-slate-950">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-emerald-900 sm:text-3xl dark:text-emerald-100">
              {t('landing.team.title')}
            </h2>
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
              {t('landing.team.subtitle')}
            </p>
          </div>

          <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex items-center gap-6 will-change-transform"
              style={{
                display: 'flex',
              }}
            >
              {/* original list */}
              <div className="flex items-center gap-6">
                {teamData.map((m) => (
                  <React.Fragment key={m.id}>{renderCardElement(m)}</React.Fragment>
                ))}
              </div>

              {/* duplicate for seamless loop */}
              <div aria-hidden="true" className="flex items-center gap-6">
                {teamData.map((m) => (
                  <React.Fragment key={`dup-${m.id}`}>{renderCardElement(m)}</React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
