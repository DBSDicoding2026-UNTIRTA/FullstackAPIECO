"use client";

import Image from "next/image";
import React, { JSX, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamData } from "@/data/team";
import { useSettings } from "@/hooks/use-settings";

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection(): JSX.Element {
  const { t } = useSettings();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(
        containerRef.current!.querySelectorAll<HTMLElement>(".team-card")
      );

      const avatars = Array.from(
        containerRef.current!.querySelectorAll<HTMLElement>(".team-avatar")
      );

      if (cards.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        tl.from(cards, {
          y: 20,
          opacity: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
        }).from(
          avatars,
          {
            scale: 0.98,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.12,
          },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderCardElement = (member: (typeof teamData)[number]) => (
    <article
      className="team-card min-w-[220px] rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-emerald-900/60 dark:bg-slate-900"
      aria-label={member.name}
    >
      <div className="team-avatar mx-auto mb-4 flex h-24 w-24 items-center justify-center">
        <div className="h-24 w-24 overflow-hidden rounded-full">
          {member.image && !member.isPlaceholder ? (
            <Image
              src={member.image}
              alt={member.name}
              width={96}
              height={96}
              className="h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border border-emerald-100 bg-emerald-50 text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                />
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 20c0-2.21 3.582-4 6-4s6 1.79 6 4"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-base font-medium text-emerald-900 dark:text-emerald-100">
        {member.name}
      </h3>

      <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-300">
        {member.role}
      </p>
    </article>
  );

  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="rounded-3xl bg-gradient-to-b from-emerald-50 to-white p-8 dark:from-emerald-950/40 dark:to-slate-950">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-emerald-900 sm:text-3xl dark:text-emerald-100">
              {t("landing.team.title")}
            </h2>

            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
              {t("landing.team.subtitle")}
            </p>
          </div>

          <div ref={containerRef} className="flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {teamData.map((member) => (
                <React.Fragment key={member.id}>
                  {renderCardElement(member)}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}