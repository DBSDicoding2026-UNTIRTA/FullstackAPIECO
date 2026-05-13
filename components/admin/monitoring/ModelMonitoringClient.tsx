"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  Gauge,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useSettings } from "@/hooks/use-settings";

/* ── Types ── */
interface ClassDist {
  label: string;
  count: number;
  avgConfidence: number;
}

interface HourlyEntry {
  hour: string;
  count: number;
  avgConfidence: number;
}

interface RecentInference {
  id: string;
  result: string;
  confidence: number;
  createdAt: string;
  userName: string;
}

interface MonitoringData {
  totalInferences: number;
  inferencesToday: number;
  avgConfidence: number;
  minConfidence: number;
  maxConfidence: number;
  confidenceBuckets: { high: number; mid: number; low: number };
  classDistribution: ClassDist[];
  hourlyBreakdown: HourlyEntry[];
  recentInferences: RecentInference[];
}

/* ── Helpers ── */
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

const confBadge = (c: number) => {
  if (c >= 0.8) return { label: "High", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" };
  if (c >= 0.5) return { label: "Mid", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" };
  return { label: "Low", cls: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300" };
};

const wasteEmoji: Record<string, string> = {
  plastic: "🧴",
  paper: "📄",
  glass: "🪟",
  metal: "🔩",
  organic: "🍂",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ───────────────────── Component ───────────────────── */
export default function ModelMonitoringClient() {
  const { t } = useSettings();
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/monitoring");
        if (!res.ok) throw new Error();
        const json: MonitoringData = await res.json();
        setData(json);
      } catch {
        setError(t("admin.monitoring.error" as never) || "Gagal memuat data monitoring.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-emerald-700 dark:text-emerald-300">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">{t("admin.monitoring.loading" as never) || "Memuat monitoring model..."}</p>
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

  const maxHourly = Math.max(...data.hourlyBreakdown.map((h) => h.count), 1);
  const totalBuckets = data.confidenceBuckets.high + data.confidenceBuckets.mid + data.confidenceBuckets.low || 1;

  const summaryCards = [
    {
      label: t("admin.monitoring.totalInferences" as never) || "Total Inferensi",
      value: data.totalInferences,
      icon: Zap,
      accent: "text-emerald-700 dark:text-emerald-300",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: t("admin.monitoring.today" as never) || "Inferensi Hari Ini",
      value: data.inferencesToday,
      icon: Clock,
      accent: "text-sky-700 dark:text-sky-300",
      bg: "bg-sky-50 dark:bg-sky-950/50",
    },
    {
      label: t("admin.monitoring.avgConf" as never) || "Avg Confidence",
      value: pct(data.avgConfidence),
      icon: Gauge,
      accent: "text-violet-700 dark:text-violet-300",
      bg: "bg-violet-50 dark:bg-violet-950/50",
    },
    {
      label: t("admin.monitoring.minMax" as never) || "Min / Max",
      value: `${pct(data.minConfidence)} – ${pct(data.maxConfidence)}`,
      icon: TrendingUp,
      accent: "text-amber-700 dark:text-amber-300",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] sm:p-8 dark:border-emerald-900/60 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          {t("admin.cards.monitoring.title" as never) || "Monitoring Model AI"}
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl dark:text-white">
          {t("admin.cards.monitoring.title" as never) || "Monitoring Model AI"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
          {t("admin.cards.monitoring.description" as never) || "Awasi status model, performa, dan hasil inferensi."}
        </p>
      </section>

      {/* ── Summary cards ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* ── Model status badge ── */}
      <section className="rounded-[1.5rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Bot className="h-6 w-6" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Waste Classification Model
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                FastAPI · TensorFlow/PyTorch · 5 class
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Activity className="h-4 w-4" />
            Active
          </div>
        </div>
      </section>

      {/* ── Confidence distribution + class breakdown ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Confidence distribution */}
        <section className="rounded-[1.5rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-base font-bold text-emerald-700 dark:text-emerald-300">
            <Gauge className="h-5 w-5" />{t("admin.monitoring.distribution" as never) || "Distribusi Confidence"}</h2>

          <div className="mt-5 space-y-3">
            {[
              {
                label: "High (≥ 80%)",
                count: data.confidenceBuckets.high,
                icon: CheckCircle2,
                color: "bg-emerald-500",
                textColor: "text-emerald-700 dark:text-emerald-300",
              },
              {
                label: "Mid (50–79%)",
                count: data.confidenceBuckets.mid,
                icon: AlertTriangle,
                color: "bg-amber-500",
                textColor: "text-amber-700 dark:text-amber-300",
              },
              {
                label: "Low (< 50%)",
                count: data.confidenceBuckets.low,
                icon: AlertTriangle,
                color: "bg-red-500",
                textColor: "text-red-700 dark:text-red-300",
              },
            ].map((b) => {
              const Icon = b.icon;
              const widthPct = ((b.count / totalBuckets) * 100).toFixed(1);
              return (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`flex items-center gap-1.5 font-medium ${b.textColor}`}>
                      <Icon className="h-4 w-4" />
                      {b.label}
                    </span>
                    <span className="tabular-nums text-slate-500 dark:text-slate-400">
                      {b.count} ({widthPct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${b.color} transition-all duration-500`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Class breakdown */}
        <section className="rounded-[1.5rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
          <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-300">{t("admin.monitoring.performance" as never) || "Performa Per Kelas"}</h2>

          <div className="mt-5 flex flex-col gap-3">
            {data.classDistribution.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">{t("admin.monitoring.noData" as never) || "Belum ada data."}</p>
            )}
            {data.classDistribution.map((c) => {
              const badge = confBadge(c.avgConfidence);
              return (
                <div
                  key={c.label}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {wasteEmoji[c.label.toLowerCase()] ?? "📦"}
                    </span>
                    <span className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
                      {c.label}
                    </span>
                    <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500">
                      {c.count}×
                    </span>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                    {pct(c.avgConfidence)} — {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Hourly chart ── */}
      <section className="rounded-[1.5rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-bold text-emerald-700 dark:text-emerald-300">
          <Clock className="h-5 w-5" />{t("admin.monitoring.hourly" as never) || "Inferensi Per Jam (24 Jam Terakhir)"}</h2>

        <div className="mt-5 flex items-end gap-[3px]" style={{ height: 140 }}>
          {data.hourlyBreakdown.map((h) => (
            <div key={h.hour} className="group relative flex flex-1 flex-col items-center">
              <span className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white group-hover:block dark:bg-slate-700">
                {h.count} ({pct(h.avgConfidence)})
              </span>
              <div
                className="w-full max-w-[18px] rounded-t-md bg-gradient-to-t from-violet-500 to-violet-300 transition-all duration-300 dark:from-violet-600 dark:to-violet-400"
                style={{
                  height: `${(h.count / maxHourly) * 100}%`,
                  minHeight: h.count > 0 ? 4 : 1,
                }}
              />
              <span className="mt-1 text-[8px] font-medium text-slate-400 dark:text-slate-500">
                {h.hour.slice(0, 2)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent inferences ── */}
      <section className="overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="border-b border-emerald-100 px-6 py-4 dark:border-emerald-900/60">
          <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-300">{t("admin.monitoring.recent" as never) || "Inferensi Terbaru"}</h2>
        </div>

        <div className="divide-y divide-emerald-50 dark:divide-emerald-900/40">
          {data.recentInferences.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
              Belum ada inferensi.
            </p>
          )}
          {data.recentInferences.map((r) => {
            const badge = confBadge(r.confidence);
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-4 px-6 py-3 transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
              >
                <span className="text-lg">{wasteEmoji[r.result.toLowerCase()] ?? "📦"}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
                    {r.result}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {r.userName} · {formatTime(r.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                  {pct(r.confidence)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
