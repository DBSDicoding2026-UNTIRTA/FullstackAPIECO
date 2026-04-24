import Link from "next/link";

import { DASHBOARD_PREVIEW_HEADER, DASHBOARD_PREVIEW_STATS } from "@/data/landing";

import Container from "@/components/shared/Container";
import SectionHeader from "@/components/shared/SectionHeader";

export default function DashboardPreview() {
  return (
    <section className="border-y border-slate-100 bg-white py-14 sm:py-20">
      <Container>
        <SectionHeader
          title={DASHBOARD_PREVIEW_HEADER.title}
          description={DASHBOARD_PREVIEW_HEADER.description}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-5 shadow-sm sm:p-8">
          <article className="rounded-2xl bg-linear-to-r from-emerald-500 to-lime-500 p-6 text-white">
            <h3 className="text-2xl font-bold">Halo, User! 👋</h3>
            <p className="mt-2 text-sm text-emerald-50">
              Selamat datang kembali. Mari lanjutkan misi pilah sampah hari ini.
            </p>
          </article>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {DASHBOARD_PREVIEW_STATS.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 text-right">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Lihat Dashboard Lengkap
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
