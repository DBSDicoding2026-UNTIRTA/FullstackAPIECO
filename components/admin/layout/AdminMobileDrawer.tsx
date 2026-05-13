"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Recycle, ShieldCheck, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";
import { getAdminRoutes, isActive } from "./AdminSidebar";

/* ───────────────────── Component ───────────────────── */
export default function AdminMobileDrawer() {
  const pathname = usePathname() || "/";
  const { t } = useSettings();
  const routes = getAdminRoutes(t as (key: string) => string);
  const [open, setOpen] = useState(false);

  const allRoutes = [...routes.main, ...routes.footer];

  return (
    <>
      {/* Hamburger button — rendered inside the topbar via portal-free approach */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("admin.mobile.openMenu" as never)}
        className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700 md:hidden dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col",
          "bg-white shadow-2xl transition-transform duration-300 ease-out",
          "dark:bg-slate-950",
          "md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-100/60 px-4 dark:border-emerald-900/40">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/25">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-emerald-700 dark:text-emerald-300">
              PilahYuk
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("admin.mobile.closeMenu" as never)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="border-b border-emerald-100/60 px-4 py-3 dark:border-emerald-900/40">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("admin.badge.admin" as never)}
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {allRoutes.map((route) => {
              const active = isActive(pathname, route.href);
              const Icon = route.icon;

              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                    )}
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span>{route.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
