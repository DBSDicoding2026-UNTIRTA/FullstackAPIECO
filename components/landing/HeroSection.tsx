import Link from "next/link";

import { LANDING_HERO_CONTENT, LANDING_HERO_HIGHLIGHTS } from "@/data/landing";
import type { HeroHighlightItem } from "@/types";

import Container from "@/components/shared/Container";

function HeroHighlightCard({ item }: { readonly item: HeroHighlightItem }) {
  return (
    <li className="rounded-xl border border-emerald-100 bg-white/70 p-3 text-center shadow-sm backdrop-blur-sm">
      <p className="text-lg font-bold text-slate-900">{item.value}</p>
      <p className="text-xs text-slate-600">{item.label}</p>
    </li>
  );
}

export default function HeroSection() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="landing-hero-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h1
              id="landing-hero-title"
              className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl"
            >
              {LANDING_HERO_CONTENT.title}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {LANDING_HERO_CONTENT.subtitle}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-lime-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {LANDING_HERO_CONTENT.primaryCta}
              </Link>
              <a
                href="#cara-kerja"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                {LANDING_HERO_CONTENT.secondaryCta}
              </a>
            </div>
            <ul className="grid grid-cols-3 gap-3" aria-label="Statistik ringkas">
              {LANDING_HERO_HIGHLIGHTS.map((item) => (
                <HeroHighlightCard key={item.id} item={item} />
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-3xl">📸</p>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">Foto Sampah</h3>
              <p className="mt-1 text-xs text-slate-600">Upload dalam hitungan detik.</p>
            </article>
            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-3xl">🤖</p>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">Analisis AI</h3>
              <p className="mt-1 text-xs text-slate-600">Klasifikasi otomatis dan akurat.</p>
            </article>
            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-3xl">⭐</p>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">Kumpulkan Poin</h3>
              <p className="mt-1 text-xs text-slate-600">Setiap aksi memberi progres nyata.</p>
            </article>
            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-3xl">🏆</p>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">Naik Ranking</h3>
              <p className="mt-1 text-xs text-slate-600">Bersaing sehat bersama komunitas.</p>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
}
