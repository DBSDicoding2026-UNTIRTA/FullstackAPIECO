"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Camera,
  Loader2,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";

import { useSettings } from "@/hooks/use-settings";

/* ── Types ── */
interface WasteDistribution {
  type: string;
  count: number;
}

interface DailyUpload {
  date: string;
  count: number;
}

interface RecentUpload {
  id: string;
  result: string;
  confidence: number;
  createdAt: string;
  user: { name: string | null; email: string; image: string | null };
}

interface StatsData {
  totalUploads: number;
  uploadsToday: number;
  uploadsThisWeek: number;
  avgConfidence: number;
  uniqueUsers: number;
  wasteDistribution: WasteDistribution[];
  dailyUploads: DailyUpload[];
  recentList: RecentUpload[];
}

/* ── Colour map for waste types ── */
const wasteColours: Record<string, string> = {
  plastic: "bg-blue-500",
  paper: "bg-amber-500",
  glass: "bg-emerald-500",
  metal: "bg-slate-500",
  organic: "bg-lime-500",
};

function wasteColor(type: string): string {
  return wasteColours[type.toLowerCase()] ?? "bg-purple-500";
}

/* ── Helpers ── */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

/* ───────────────────── Component ───────────────────── */
export default function UploadStatsClient() {
  const { t } = useSettings();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const json: StatsData = await res.json();
        setData(json);
      } catch {
        setError(t("admin.stats.error" as never) || "Gagal memuat statistik upload.");
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-emerald-700 dark:text-emerald-300">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">{t("admin.stats.loading" as never) || "Memuat statistik..."}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
        {error ?? "Terjadi kesalahan."}
      </div>
    );
  }

  const maxDaily = Math.max(...data.dailyUploads.map((d) => d.count), 1);
  const totalWaste = data.wasteDistribution.reduce((s, w) => s + w.count, 0) || 1;

  /* ── Summary cards ── */
  const summaryCards = [
    {
      label: t("admin.stats.totalUploads" as never) || "Total Upload",
      value: data.totalUploads,
      icon: Upload,
      accent: "text-emerald-700 dark:text-emerald-300",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: t("admin.stats.today" as never) || "Hari Ini",
      value: data.uploadsToday,
      icon: CalendarDays,
      accent: "text-sky-700 dark:text-sky-300",
      bg: "bg-sky-50 dark:bg-sky-950/50",
    },
    {
      label: t("admin.stats.thisWeek" as never) || "Minggu Ini",
      value: data.uploadsThisWeek,
      icon: TrendingUp,
      accent: "text-violet-700 dark:text-violet-300",
      bg: "bg-violet-50 dark:bg-violet-950/50",
    },
    {
      label: t("admin.stats.uniqueUsers" as never) || "User Unik",
      value: data.uniqueUsers,
      icon: Users,
      accent: "text-amber-700 dark:text-amber-300",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      label: t("admin.stats.avgConfidence" as never) || "Rata-rata Confidence",
      value: `${(data.avgConfidence * 100).toFixed(1)}%`,
      icon: Camera,
      accent: "text-rose-700 dark:text-rose-300",
      bg: "bg-rose-50 dark:bg-rose-950/50",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] sm:p-8 dark:border-emerald-900/60 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          {t("admin.cards.stats.title" as never) || "Statistik Upload"}
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl dark:text-white">
          {t("admin.cards.stats.title" as never) || "Statistik Upload"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
          {t("admin.cards.stats.description" as never) || "Lihat ringkasan aktivitas upload dan tren penggunaan."}
        </p>
      </section>

      {/* ── Summary cards ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight dark:text-white">
                {card.value}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
            </article>
          );
        })}
      </section>

      {/* ── Chart + Distribution ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Daily bar chart */}
        <section className="rounded-[1.5rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-base font-bold">
              {t("admin.stats.dailyChart" as never) || "Upload Harian (14 Hari Terakhir)"}
            </h2>
          </div>

          <div className="mt-5 flex items-end gap-1" style={{ height: 180 }}>
            {data.dailyUploads.map((d) => (
              <div key={d.date} className="group relative flex flex-1 flex-col items-center">
                {/* tooltip */}
                <span className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white group-hover:block dark:bg-slate-700">
                  {d.count}
                </span>
                <div
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-300 transition-all duration-300 dark:from-emerald-600 dark:to-emerald-400"
                  style={{
                    height: `${(d.count / maxDaily) * 100}%`,
                    minHeight: d.count > 0 ? 6 : 2,
                  }}
                />
                <span className="mt-1.5 text-[9px] font-medium text-slate-400 dark:text-slate-500">
                  {formatShortDate(d.date)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Waste distribution */}
        <section className="rounded-[1.5rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
          <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-300">
            {t("admin.stats.wasteDistribution" as never) || "Distribusi Jenis Sampah"}
          </h2>

          <div className="mt-5 flex flex-col gap-3">
            {data.wasteDistribution.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">{t("admin.stats.noData" as never) || "Belum ada data."}</p>
            )}
            {data.wasteDistribution.map((w) => {
              const pct = ((w.count / totalWaste) * 100).toFixed(1);
              return (
                <div key={w.type}>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="capitalize text-slate-700 dark:text-slate-200">{w.type}</span>
                    <span className="tabular-nums text-slate-500 dark:text-slate-400">
                      {w.count} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${wasteColor(w.type)} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Recent uploads table ── */}
      <section className="overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="border-b border-emerald-100 px-6 py-4 dark:border-emerald-900/60">
          <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-300">
            {t("admin.stats.recentUploads" as never) || "Upload Terbaru"}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-emerald-900/40 dark:text-slate-500">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">{t("ai.result.wasteType" as never) || "Jenis Sampah"}</th>
                <th className="px-6 py-3">Confidence</th>
                <th className="px-6 py-3">{t("admin.users.joined" as never) || "Tanggal"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/40">
              {data.recentList.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-slate-400 dark:text-slate-500"
                  >
                    Belum ada upload.
                  </td>
                </tr>
              )}
              {data.recentList.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20">
                  <td className="whitespace-nowrap px-6 py-3">
                    <div className="flex items-center gap-2">
                      {r.user.image ? (
                        <Image
                          src={r.user.image}
                          alt={r.user.name ?? ""}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {(r.user.name ?? r.user.email)[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {r.user.name || r.user.email}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <span className={`h-2 w-2 rounded-full ${wasteColor(r.result)}`} />
                      {r.result}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 font-medium tabular-nums text-slate-600 dark:text-slate-300">
                    {(r.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-slate-500 dark:text-slate-400">
                    {formatDate(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
