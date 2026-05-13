"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  Database,
  FileQuestion,
  LayoutDashboard,
  Recycle,
  Settings,
  ShieldCheck,
  Users,
  Menu,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";

/* ── Route definitions ── */
interface AdminRoute {
  label: string;
  href: string;
  icon: LucideIcon;
}

function getAdminRoutes(t: (key: string) => string): {
  main: AdminRoute[];
  footer: AdminRoute[];
} {
  return {
    main: [
      { label: t("admin.sidebar.dashboard"), href: "/admin", icon: LayoutDashboard },
      { label: t("admin.sidebar.quiz"), href: "/admin/manage-quiz", icon: FileQuestion },
      { label: t("admin.sidebar.users"), href: "/admin/manage-user", icon: Users },
      { label: t("admin.sidebar.stats"), href: "/admin/statistik-upload", icon: BarChart3 },
      { label: t("admin.sidebar.monitoring"), href: "/admin/monitoring-model", icon: Bot },
      { label: t("admin.sidebar.dataset"), href: "/admin/dataset", icon: Database },
    ],
    footer: [
      { label: t("admin.sidebar.settings"), href: "/settings", icon: Settings },
    ],
  };
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

const SIDEBAR_KEY = "pilahyuk-admin-sidebar";

/* ───────────────────── Component ───────────────────── */
export default function AdminSidebar() {
  const pathname = usePathname() || "/";
  const { t } = useSettings();
  const routes = getAdminRoutes(t as (key: string) => string);

  const [collapsed, setCollapsed] = useState(false);

  /* Restore collapsed state from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      if (stored === "collapsed") setCollapsed(true);
    } catch { /* noop */ }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_KEY, next ? "collapsed" : "expanded");
    } catch { /* noop */ }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden md:flex flex-col",
        "border-r border-emerald-100/80 bg-white/95 backdrop-blur-xl",
        "shadow-[4px_0_24px_-12px_rgba(16,185,129,0.10)]",
        "transition-all duration-300 ease-in-out",
        "dark:border-emerald-900/50 dark:bg-slate-950/95",
        collapsed ? "w-[72px]" : "w-[256px]",
      )}
    >
      {/* ── Logo ── */}
      <div className={cn(
        "flex h-16 shrink-0 items-center gap-3 border-b border-emerald-100/60 px-4",
        "dark:border-emerald-900/40",
        collapsed && "justify-center px-0",
      )}>
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/25">
            <Recycle className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-extrabold tracking-tight text-emerald-700 dark:text-emerald-300">
              PilahYuk
            </span>
          )}
        </Link>
      </div>

      {/* ── Admin badge & Toggle ── */}
      <div className={cn(
        "shrink-0 flex items-center border-b border-emerald-100/60 px-4 py-3",
        "dark:border-emerald-900/40",
        collapsed ? "justify-center px-2" : "justify-between",
      )}>
        {!collapsed && (
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700",
            "dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] uppercase tracking-widest"
          )}>
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            {t("admin.badge.admin" as never)}
          </span>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? t("admin.sidebar.expand" as never) : t("admin.sidebar.collapse" as never)}
          className={cn(
            "flex items-center justify-center rounded-xl transition-all duration-200",
            "text-slate-400 hover:bg-slate-50 hover:text-emerald-600",
            "dark:text-slate-500 dark:hover:bg-slate-900/60 dark:hover:text-emerald-400",
            collapsed ? "h-8 w-8" : "h-8 w-8 -mr-1.5",
          )}
        >
          <Menu className="h-4 w-4 shrink-0" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <ul className="flex flex-col gap-1">
          {routes.main.map((route) => {
            const active = isActive(pathname, route.href);
            const Icon = route.icon;

            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  title={collapsed ? route.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-sm font-medium transition-all duration-200",
                    "outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200",
                    collapsed && "justify-center px-0",
                  )}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  )}

                  <Icon className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-110",
                  )} />

                  {!collapsed && (
                    <span className="truncate">{route.label}</span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-700">
                      {route.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer nav ── */}
      <div className="shrink-0 border-t border-emerald-100/60 px-3 py-3 dark:border-emerald-900/40">
        <ul className="flex flex-col gap-1">
          {routes.footer.map((route) => {
            const active = isActive(pathname, route.href);
            const Icon = route.icon;

            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  title={collapsed ? route.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{route.label}</span>}
                  {collapsed && (
                    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-700">
                      {route.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

      </div>
    </aside>
  );
}

/* Re-export helpers so other admin layout components can reuse */
export { getAdminRoutes, isActive, SIDEBAR_KEY };
export type { AdminRoute };
