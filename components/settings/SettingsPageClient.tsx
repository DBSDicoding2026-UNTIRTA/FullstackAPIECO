"use client";

import {
  LockKeyhole,
  Palette,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import AppNavbar from "@/components/shared/AppNavbar";
import AppShell from "@/components/shared/AppShell";
import AccountSettings from "@/components/settings/AccountSettings";
import DangerZone from "@/components/settings/DangerZone";
import PreferenceSettings from "@/components/settings/PreferenceSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import { useSettings } from "@/hooks/use-settings";
import type { SettingsSecurity } from "@/types/settings";

interface SettingsPageClientProps {
  readonly security: SettingsSecurity;
}

export default function SettingsPageClient({
  security,
}: SettingsPageClientProps) {
  const { profile, preferences, settings, t } = useSettings();
  const role = settings.role ?? "USER";
  const settingsNavigation = [
    { href: "#profile", label: t("settings.profile"), icon: UserRound },
    { href: "#account", label: t("settings.account"), icon: LockKeyhole },
    { href: "#preferences", label: t("settings.preferences"), icon: Palette },
    { href: "#security", label: t("settings.security"), icon: ShieldCheck },
    { href: "#danger-zone", label: t("settings.dangerZone"), icon: Trash2 },
  ] as const;

  const navbarUser = {
    name: profile.name || null,
    image: profile.avatar || null,
    role,
  };

  return (
    <AppShell variant={role === "ADMIN" ? "admin" : "user"}>
      <main className="min-h-screen bg-[#f4faf6] pb-24 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <AppNavbar user={navbarUser} />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] transition-colors duration-300 dark:border-emerald-900/50 dark:bg-slate-900 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("settings.badge")}
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  {t("settings.title")}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  {t("settings.description")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-2 dark:border-emerald-900/60 dark:bg-emerald-950/20 sm:min-w-64">
                <div className="rounded-xl bg-white px-3 py-2 dark:bg-slate-950">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t("settings.provider")}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {security.loginProviders.join(", ") || "Credentials"}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 dark:bg-slate-950">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t("settings.status")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {t("settings.activeNow")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <nav className="sticky top-24 space-y-2 rounded-2xl border border-emerald-100 bg-white p-3 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] transition-colors duration-300 dark:border-emerald-900/50 dark:bg-slate-900">
                {settingsNavigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </aside>

            <div className="space-y-6">
              <ProfileSettings profile={profile} />
              <AccountSettings canChangePassword={security.canChangePassword} />
              <PreferenceSettings preferences={preferences} />
              <SecuritySettings security={security} />
              <DangerZone />
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

