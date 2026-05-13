'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    { label: t('landing.nav.features'), href: '#features' },
    { label: t('landing.nav.stats'), href: '#stats' },
    { label: t('landing.nav.start'), href: '#cta' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-2xl">♻️</span>
            <Link href="/" className="text-xl md:text-2xl font-bold text-emerald-600">
              Pilah Yuk!!
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 transition-colors text-sm font-medium relative group hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link
              href={ctaHref}
              className="inline-flex px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-emerald-700"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 transition-colors hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-expanded="false"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={ctaHref}
                className="mt-4 block w-full rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-2 text-center font-semibold text-white transition-all hover:shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
