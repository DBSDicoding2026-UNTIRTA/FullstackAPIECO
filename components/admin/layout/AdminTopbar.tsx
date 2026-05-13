"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";
import AdminAvatarDropdown from "./AdminAvatarDropdown";

/* ── Page title map (pathname → i18n key) ── */
const PAGE_TITLES: Record<string, string> = {
  "/admin": "admin.sidebar.dashboard",
  "/admin/manage-quiz": "admin.sidebar.quiz",
  "/admin/manage-user": "admin.sidebar.users",
  "/admin/statistik-upload": "admin.sidebar.stats",
  "/admin/monitoring-model": "admin.sidebar.monitoring",
  "/admin/dataset": "admin.sidebar.dataset",
  "/admin/users": "admin.sidebar.users",
  "/admin/model": "admin.sidebar.monitoring",
  "/settings": "admin.sidebar.settings",
};

function getPageTitle(pathname: string, t: (key: string) => string): string {
  const exact = PAGE_TITLES[pathname];
  if (exact) return t(exact);

  /* Try prefix match */
  for (const [route, key] of Object.entries(PAGE_TITLES)) {
    if (route !== "/admin" && pathname.startsWith(route)) {
      return t(key);
    }
  }

  return t("admin.title");
}

/* ───────────────────── Component ───────────────────── */
export default function AdminTopbar() {
  const pathname = usePathname() || "/admin";
  const { t, theme, setTheme, language, setLanguage } = useSettings();
  const pageTitle = getPageTitle(pathname, t as (key: string) => string);

  const cycleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const router = useRouter();

  const toggleLanguage = async () => {
    const previousLang = language;
    const newLang = language === "id" ? "en" : "id";
    setLanguage(newLang); // Optimistic update

    try {
      const response = await fetch("/api/settings/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      });

      if (!response.ok) {
        throw new Error("Failed to save language preference");
      }

      router.refresh();
    } catch (e) {
      setLanguage(previousLang);
      console.error("Failed to save language preference", e);
    }
  };

  const themeIcon = theme === "dark" ? Moon : Sun;
  const ThemeIcon = themeIcon;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-20 items-center gap-4 px-5 md:h-16 md:px-6",
        "border-b border-emerald-100/60 bg-white/90 backdrop-blur-xl",
        "transition-colors duration-300",
        "dark:border-emerald-900/40 dark:bg-slate-950/90",
      )}
    >
      <Link href="/admin" className="inline-flex items-center gap-2 md:hidden">
        <span className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden="true" />
        <span className="text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
          {t("common.appName" as never)}
        </span>
      </Link>

      {/* Page title */}
      <h1 className="hidden flex-1 truncate text-base font-semibold text-slate-900 dark:text-white md:block sm:text-lg">
        {pageTitle}
      </h1>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={cycleTheme}
          aria-label={t("admin.topbar.toggleTheme" as never)}
          title={`${t("admin.topbar.toggleTheme" as never)} (${theme})`}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-xl",
            "text-slate-500 transition-all duration-200",
            "hover:bg-emerald-50 hover:text-emerald-700",
            "dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300",
            "max-md:hidden",
          )}
        >
          <ThemeIcon className="h-[18px] w-[18px]" />
        </button>

        {/* Language toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={t("admin.topbar.toggleLang" as never)}
          title={t("admin.topbar.toggleLang" as never)}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-xl px-2.5",
            "text-xs font-semibold text-slate-500 transition-all duration-200",
            "hover:bg-emerald-50 hover:text-emerald-700",
            "dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300",
            "max-md:hidden",
          )}
        >
          <Globe className="h-[16px] w-[16px]" />
          <span className="hidden sm:inline uppercase">{language}</span>
        </button>

        {/* Separator */}
        <div className="hidden h-6 w-px bg-emerald-100/80 md:block dark:bg-emerald-900/40" />

        {/* Avatar dropdown */}
        <AdminAvatarDropdown />
      </div>
    </header>
  );
}
