"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  LogOut,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  Monitor,
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

/* ── Helpers ── */
function getInitials(name: string | null): string {
  if (!name) return "AD";
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? "A"}${second?.[0] ?? "D"}`.toUpperCase();
}

/* ───────────────────── Component ───────────────────── */
export default function AdminAvatarDropdown() {
  const { profile, settings, t, setTheme, setLanguage, theme, language } = useSettings();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = profile.name || "Admin";
  const displayEmail = profile.email || settings.profile?.email || "";
  const displayImage = profile.avatar || null;

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-2 py-1.5 md:rounded-xl",
            "border border-emerald-100/80 bg-white/80 text-left",
            "transition-all duration-200",
            "hover:border-emerald-200 hover:bg-emerald-50/80 hover:shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
            "dark:border-emerald-900/50 dark:bg-slate-900/80 dark:hover:bg-emerald-950/40",
          )}
        >
          <Avatar className="h-10 w-10 border border-emerald-200/60 md:h-8 md:w-8 dark:border-emerald-800/60">
            <AvatarImage src={displayImage ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-50 text-xs font-bold text-emerald-700 dark:from-emerald-950 dark:to-slate-900 dark:text-emerald-300">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
            {displayName}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-emerald-700 transition-transform duration-200 md:text-slate-400",
              open && "rotate-180",
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-72 rounded-2xl border border-emerald-100/80 bg-white p-0",
          "shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)]",
          "dark:border-emerald-900/50 dark:bg-slate-950",
        )}
      >
        {/* ── Profile header ── */}
        <div className="border-b border-emerald-100/60 p-4 dark:border-emerald-900/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-emerald-200/60 dark:border-emerald-800/60">
              <AvatarImage src={displayImage ?? undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-50 text-sm font-bold text-emerald-700 dark:from-emerald-950 dark:to-slate-900 dark:text-emerald-300">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {displayName}
              </p>
              {displayEmail && (
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {displayEmail}
                </p>
              )}
              <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="h-3 w-3" />
                {t("admin.badge.admin" as never)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Menu items ── */}
        <div className="p-1.5">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-700 dark:text-slate-300 dark:focus:bg-emerald-950/40 dark:focus:text-emerald-300">
              <Link href="/settings" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <Settings className="h-4 w-4" />
                {t("admin.dropdown.settings" as never)}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1 bg-emerald-100/60 dark:bg-emerald-900/40" />

          {/* Theme toggle */}
          <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t("admin.dropdown.theme" as never)}
          </DropdownMenuLabel>
          <div className="flex gap-1 px-3 pb-2">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5",
                    "text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Language toggle */}
          <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t("admin.dropdown.language" as never)}
          </DropdownMenuLabel>
          <div className="flex gap-1 px-3 pb-2">
            {(["id", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5",
                  "text-xs font-medium transition-all duration-200",
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

        {/* ── Logout ── */}
        <div className="border-t border-emerald-100/60 p-1.5 dark:border-emerald-900/40">
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={loggingOut}
            className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:focus:bg-red-950/30 dark:focus:text-red-300"
          >
            <LogOut className="mr-3 h-4 w-4" />
            {loggingOut ? t("admin.dropdown.loggingOut" as never) : t("admin.dropdown.logout" as never)}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
