"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import { useSettings } from "@/hooks/use-settings";

/* ── Types ── */
interface DatasetItem {
  id: string;
  imageUrl: string;
  result: string;
  confidence: number;
  createdAt: string;
  user: { name: string | null; email: string; image: string | null };
}

interface DatasetResponse {
  items: DatasetItem[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  wasteTypes: string[];
  summary: { totalRecords: number; avgConfidence: number };
}

/* ── Helpers ── */
const wasteColours: Record<string, string> = {
  plastic: "bg-blue-500",
  paper: "bg-amber-500",
  glass: "bg-emerald-500",
  metal: "bg-slate-500",
  organic: "bg-lime-500",
};

function wasteColor(type: string) {
  return wasteColours[type.toLowerCase()] ?? "bg-purple-500";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ───────────────────── Component ───────────────────── */
export default function DatasetClient() {
  const { t } = useSettings();
  const [data, setData] = useState<DatasetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (filterType) params.set("type", filterType);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/dataset?${params}`);
      if (!res.ok) throw new Error();
      const json: DatasetResponse = await res.json();
      setData(json);
    } catch {
      setError("Gagal memuat dataset.");
    } finally {
      setLoading(false);
    }
  }, [page, filterType, search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] sm:p-8 dark:border-emerald-900/60 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          {t("nav.dataset" as never) || "Dataset"}
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl dark:text-white">{t("admin.dataset.title" as never) || "Dataset Klasifikasi"}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">{t("admin.dataset.desc" as never) || "Seluruh data hasil klasifikasi AI yang sudah tersimpan di database. Gunakan filter untuk menelusuri dataset."}</p>
      </section>

      {/* ── Summary ── */}
      {data && (
        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Database className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums dark:text-white">
              {data.summary.totalRecords}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Total Data</p>
          </article>

          <article className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums dark:text-white">
              {(data.summary.avgConfidence * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Rata-rata Confidence</p>
          </article>

          <article className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <Database className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums dark:text-white">
              {data.wasteTypes.length}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Kategori Sampah</p>
          </article>
        </section>
      )}

      {/* ── Filter & Search bar ── */}
      <section className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-emerald-100 bg-white p-4 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => {
            setLoading(true);
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:ring-2 focus:ring-emerald-300 dark:border-emerald-900/60 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">{t("admin.dataset.allCategories" as never) || "Semua Kategori"}</option>
          {data?.wasteTypes.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("admin.dataset.search" as never) || "Cari nama atau email user..."}
            className="w-full rounded-xl border border-emerald-100 bg-emerald-50/50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-300 dark:border-emerald-900/60 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
          />
        </form>

        {data && (
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {data.total} hasil
          </span>
        )}
      </section>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-emerald-700 dark:text-emerald-300">
          <Loader2 className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">{t("admin.dataset.loading" as never) || "Memuat dataset..."}</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : (
        <section className="overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-emerald-900/40 dark:text-slate-500">
                  <th className="px-6 py-3">Preview</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">{t("admin.dataset.category" as never) || "Kategori"}</th>
                  <th className="px-6 py-3">{t("admin.dataset.confidence" as never) || "Confidence"}</th>
                  <th className="px-6 py-3">{t("admin.dataset.date" as never) || "Tanggal"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/40">
                {data?.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                    >
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
                {data?.items.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
                  >
                    {/* Preview */}
                    <td className="px-6 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg border border-emerald-100 bg-slate-100 dark:border-emerald-900/60 dark:bg-slate-800">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.result}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">-</div>
                        )}
                      </div>
                    </td>

                    {/* User */}
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-2">
                        {item.user.image ? (
                          <Image
                            src={item.user.image}
                            alt=""
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {(item.user.name ?? item.user.email)[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {item.user.name || item.user.email}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-6 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <span className={`h-2 w-2 rounded-full ${wasteColor(item.result)}`} />
                        {item.result}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="whitespace-nowrap px-6 py-3 font-medium tabular-nums text-slate-600 dark:text-slate-300">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-3 text-slate-500 dark:text-slate-400">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-emerald-50 px-6 py-3 dark:border-emerald-900/40">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Halaman {data.page} dari {data.totalPages}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setLoading(true);
                    setPage((p) => p - 1);
                  }}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-emerald-50 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-emerald-950/40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= (data?.totalPages ?? 1)}
                  onClick={() => {
                    setLoading(true);
                    setPage((p) => p + 1);
                  }}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-emerald-50 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-emerald-950/40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
