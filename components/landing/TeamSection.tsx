"use client";

import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { teamData } from '@/data/team';

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection(): JSX.Element {
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
      className="team-card min-w-[220px] flex-shrink-0 bg-white border border-emerald-100 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-200 ease-out hover:shadow-md hover:border-emerald-200"
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

      <h3 className="text-base font-medium text-emerald-900">{member.name}</h3>
      <p className="mt-1 text-sm text-emerald-600">{member.role}</p>
    </article>
  );

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-6 sm:px-8 lg:px-12">
        <div className="bg-gradient-to-b from-emerald-50 to-white rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-900">Tim Pilah Yuk!!</h2>
            <p className="mt-2 text-sm text-emerald-700">Orang-orang di balik pengembangan aplikasi klasifikasi sampah berbasis AI.</p>
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
