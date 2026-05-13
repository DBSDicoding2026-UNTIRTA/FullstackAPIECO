"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Globe,
  LogOut,
  Monitor,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";

import type { Role } from "@/lib/generated/prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppNavbarUser {
  readonly name: string | null;
  readonly image: string | null;
  readonly role: Role;
}

interface AppNavbarProps {
  readonly user: AppNavbarUser;
}

function getInitials(name: string | null): string {
  if (!name) return "PU";

  const [first, second] = name.trim().split(/\s+/);
  const initials = `${first?.[0] ?? "P"}${second?.[0] ?? "U"}`;
  return initials.toUpperCase();
}

export default function AppNavbar({ user }: AppNavbarProps) {
  const {
    language,
    profile,
    settings,
    setLanguage,
    setTheme,
    t,
    theme,
  } = useSettings();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const role = settings.role ?? user.role;
  const displayName = profile.name || user.name || null;
  const displayEmail = profile.email || "";
  const displayImage = profile.avatar || user.image || null;
  const homeHref = role === "ADMIN" ? "/admin" : "/dashboard";
  const ThemeIcon = theme === "dark" ? Moon : Sun;

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  const savePreferences = async (
    preferences: Partial<{ theme: typeof theme; language: typeof language }>,
  ) => {
    const response = await fetch("/api/settings/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error("Failed to save preferences");
    }
  };

  const handleThemeChange = async (nextTheme: typeof theme) => {
    const previousTheme = theme;
    setTheme(nextTheme);

    try {
      await savePreferences({ theme: nextTheme });
      router.refresh();
    } catch (error) {
      setTheme(previousTheme);
      console.error("Failed to save theme preference", error);
    }
  };

  const handleLanguageChange = async (nextLanguage: typeof language) => {
    const previousLanguage = language;
    setLanguage(nextLanguage);

    try {
      await savePreferences({ language: nextLanguage });
      router.refresh();
    } catch (error) {
      setLanguage(previousLanguage);
      console.error("Failed to save language preference", error);
    }
  };

  const toggleTheme = () => {
    void handleThemeChange(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    void handleLanguageChange(language === "id" ? "en" : "id");
  };

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur-sm transition-colors duration-300 dark:border-emerald-900/60 dark:bg-slate-950/95">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Navigasi aplikasi">
        <Link href={homeHref} className="inline-flex items-center gap-2 rounded-md px-1 py-1 text-slate-900">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-300 sm:text-xl">
            {t("common.appName")}
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t("admin.topbar.toggleTheme" as never)}
            title={`${t("admin.topbar.toggleTheme" as never)} (${theme})`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
          >
            <ThemeIcon className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t("admin.topbar.toggleLang" as never)}
            title={t("admin.topbar.toggleLang" as never)}
            className="inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-xs font-semibold text-slate-500 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
          >
            <Globe className="h-[16px] w-[16px]" />
            <span className="hidden uppercase sm:inline">{language}</span>
          </button>

          <div className="hidden h-6 w-px bg-emerald-100/80 sm:block dark:bg-emerald-900/40" />

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={t("nav.openProfileMenu")}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-2 py-1.5 text-left transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-slate-900 dark:hover:bg-emerald-950"
            >
              <Avatar className="h-8 w-8 border border-emerald-100">
                <AvatarImage
                  src={displayImage ?? undefined}
                  alt={displayName ?? t("common.user")}
                />
                <AvatarFallback className="bg-emerald-50 text-xs font-semibold text-emerald-700">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-36 truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
                {displayName ?? t("common.user")}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-emerald-700 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              />
            </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-80 rounded-2xl border border-emerald-100 bg-white p-0 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)] dark:border-emerald-900/60 dark:bg-slate-900"
            >
              <div className="border-b border-emerald-100/60 p-4 dark:border-emerald-900/40">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-emerald-200/60 dark:border-emerald-800/60">
                    <AvatarImage
                      src={displayImage ?? undefined}
                      alt={displayName ?? t("common.user")}
                    />
                    <AvatarFallback className="bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {displayName ?? t("common.user")}
                    </p>
                    {displayEmail ? (
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {displayEmail}
                      </p>
                    ) : null}
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <ShieldCheck className="h-3 w-3" />
                      {role === "ADMIN"
                        ? t("admin.badge.admin" as never)
                        : t("common.user")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1.5">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-700 dark:text-slate-200 dark:focus:bg-emerald-950/40 dark:focus:text-emerald-300">
                    <Link href="/settings" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                      <Settings className="h-4 w-4" aria-hidden="true" />
                      {t("nav.settings")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 bg-emerald-100/60 dark:bg-emerald-900/40" />

                <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("admin.dropdown.theme" as never)}
                </DropdownMenuLabel>
                <div className="flex gap-1 px-3 pb-2">
                  {themeOptions.map((option) => {
                    const OptionIcon = option.icon;
                    const isActive = theme === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => void handleThemeChange(option.value)}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200",
                          isActive
                            ? "bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                        )}
                      >
                        <OptionIcon className="h-3.5 w-3.5" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("admin.dropdown.language" as never)}
                </DropdownMenuLabel>
                <div className="flex gap-1 px-3 pb-2">
                  {(["id", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => void handleLanguageChange(lang)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200",
                        language === lang
                          ? "bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                      )}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {lang === "id" ? "Indonesia" : "English"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-emerald-100/60 p-1.5 dark:border-emerald-900/40">
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:focus:bg-red-950/30 dark:focus:text-red-300"
                >
                  <LogOut className="mr-3 h-4 w-4" aria-hidden="true" />
                  {isLoggingOut
                    ? t("admin.dropdown.loggingOut" as never)
                    : t("admin.dropdown.logout" as never)}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
