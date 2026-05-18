"use client";

import Link from "next/link";
import { ShieldCheck, Upload } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";

export default function UploadCard() {
  const { t } = useSettings();

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">{t("dashboard.upload.title")}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("dashboard.upload.subtitle")}</p>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline-flex dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {t("dashboard.upload.smartScan")}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 dark:border-emerald-900 dark:bg-emerald-950/10">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Upload className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("dashboard.upload.instruction")}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 sm:justify-start dark:text-slate-300">
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900">{t("dashboard.upload.tagRecycle")}</span>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900">{t("dashboard.upload.tagPlastic")}</span>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900">{t("dashboard.upload.tagCardboard")}</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/ai-analyst"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.99]"
      >
        <Upload className="h-4 w-4" aria-hidden="true" />
        {t("dashboard.upload.selectImage")}
      </Link>
    </section>
  );
}
