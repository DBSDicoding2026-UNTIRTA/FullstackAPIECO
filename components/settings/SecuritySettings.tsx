"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  CalendarDays,
  Clock3,
  KeyRound,
  Loader2,
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import SettingsSection from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/use-settings";
import type { SettingsSecurity } from "@/types/settings";

interface SecuritySettingsProps {
  readonly security: SettingsSecurity;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Belum tersedia";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Belum tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function SecurityRow({
  icon: Icon,
  label,
  value,
}: {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-4 last:border-b-0 dark:border-slate-800">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <Icon className="h-4.5 w-4.5" aria-hidden={true} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SecuritySettings({ security }: SecuritySettingsProps) {
  const { t } = useSettings();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await signOut({
        callbackUrl: "/login",
      });
    } catch {
      toast.error(t("settings.security.errLogout" as never));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SettingsSection
      id="security"
      title={t("settings.security")}
      description={t("settings.securityDescription")}
      icon={ShieldCheck}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("settings.securityDescription")}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="h-10 rounded-xl border-emerald-200 bg-white px-4 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800/60 dark:bg-slate-950 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="h-4 w-4" aria-hidden="true" />
            )}
            {isLoggingOut ? t("common.logoutProgress") : t("common.logout")}
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-white px-4 dark:border-emerald-900/60 dark:bg-slate-900">
          <SecurityRow
            icon={CalendarDays}
            label={t("settings.createdAt")}
            value={formatDate(security.createdAt)}
          />
          <SecurityRow
            icon={Clock3}
            label={t("settings.lastLogin")}
            value={formatDate(security.lastLoginAt)}
          />
          <SecurityRow
            icon={KeyRound}
            label={t("settings.loginProvider")}
            value={security.loginProviders.join(", ") || "Credentials"}
          />
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <SecurityRow
            icon={MonitorSmartphone}
            label={t("settings.activeSession")}
            value={t("settings.activeNow")}
          />
          <SecurityRow
            icon={ShieldCheck}
            label={t("settings.sessionStrategy")}
            value={security.activeSession.strategy}
          />
          <SecurityRow
            icon={Clock3}
            label={t("settings.sessionExpires")}
            value={formatDate(security.activeSession.expires)}
          />
        </div>
      </div>
    </SettingsSection>
  );
}
