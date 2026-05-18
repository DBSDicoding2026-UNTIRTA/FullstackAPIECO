'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

interface NavbarProps {
  readonly ctaLabel: string;
  readonly ctaHref: '/login' | '/dashboard' | '/admin';
}

export default function Navbar({ ctaLabel, ctaHref }: NavbarProps) {
  const { t } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: t('landing.nav.home'), href: '#home' },
    { label: t('landing.nav.how'), href: '#how-it-works' },
    { label: 'Demo', href: '#demo' },
    { label: t('landing.nav.stats'), href: '#stats' },
    { label: t('nav.leaderboard'), href: '#leaderboard' },
    { label: 'Team', href: '#team' },
    { label: t('landing.nav.start'), href: '#cta' },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/70 bg-white/80 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_16px_45px_rgba(2,6,23,0.45)]">
        <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm transition-transform duration-300 hover:scale-105 dark:bg-emerald-900/20 dark:text-emerald-300">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white md:text-xl">
                Pilah Yuk!!
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI waste gamification platform</p>
            </div>
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
              >
                {link.label}
                <span className="block h-px w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/20 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <span aria-hidden="true">→</span>
              {ctaLabel}
            </Link>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/90 p-2.5 text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-slate-200/70 px-3 py-3 dark:border-white/10 lg:hidden">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={ctaHref}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-emerald-600 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400"
                onClick={() => setIsOpen(false)}
              >
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
