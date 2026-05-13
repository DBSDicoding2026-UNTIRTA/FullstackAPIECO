"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useSettings } from "@/hooks/use-settings";

export default function UploadCard() {
  const { t } = useSettings();
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!cardRef.current) {
        return;
      }

      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          scale: 0.97,
          y: 18,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          delay: 0.2,
        },
      );
    }, cardRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={cardRef}
      className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_16px_34px_-24px_rgba(16,185,129,0.55)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl dark:bg-emerald-500/10" aria-hidden="true" />

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.upload.title")}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("dashboard.upload.subtitle")}</p>
        </div>
        <div className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline-flex dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <span aria-hidden="true">♻️</span>
          {t("dashboard.upload.smartScan")}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-5 sm:p-6 dark:border-emerald-700 dark:bg-emerald-950/20">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-lime-500 text-2xl text-white shadow-lg shadow-emerald-700/20">
            🗑️
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("dashboard.upload.instruction")}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-700 sm:justify-start dark:text-emerald-300">
              <span className="rounded-full bg-white px-2 py-1 dark:bg-slate-800">{t("dashboard.upload.tagRecycle")}</span>
              <span className="rounded-full bg-white px-2 py-1 dark:bg-slate-800">{t("dashboard.upload.tagPlastic")}</span>
              <span className="rounded-full bg-white px-2 py-1 dark:bg-slate-800">{t("dashboard.upload.tagCardboard")}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-lime-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:brightness-105 active:scale-[0.99]"
      >
        {t("dashboard.upload.selectImage")}
      </button>
    </section>
  );
}
