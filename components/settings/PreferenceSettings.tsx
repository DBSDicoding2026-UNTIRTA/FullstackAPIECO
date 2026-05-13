"use client";

import { useMemo, useState } from "react";
import {
  Globe2,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Save,
  SunMedium,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsSection from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/use-settings";
import type {
  LanguagePreference,
  SettingsPreferences,
  ThemePreference,
} from "@/types/settings";

interface PreferenceSettingsProps {
  readonly preferences: SettingsPreferences;
}

interface PreferencesApiResponse {
  message?: string;
  preferences?: SettingsPreferences;
}

type PreferenceRowProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
};

function PreferenceRow({
  icon: Icon,
  title,
  description,
  children,
}: PreferenceRowProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <Icon className="h-4.5 w-4.5" aria-hidden={true} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="sm:min-w-44 sm:text-right">{children}</div>
    </div>
  );
}

export default function PreferenceSettings({
  preferences,
}: PreferenceSettingsProps) {
  const {
    preferences: globalPreferences,
    t,
    updatePreferences: updateGlobalPreferences,
  } = useSettings();
  const initialPreferences = globalPreferences ?? preferences;
  const [savedPreferences, setSavedPreferences] = useState(initialPreferences);
  const [form, setForm] = useState(initialPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedPreferences),
    [form, savedPreferences],
  );

  const updatePreference = <K extends keyof SettingsPreferences>(
    field: K,
    value: SettingsPreferences[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    updateGlobalPreferences({ [field]: value } as Partial<SettingsPreferences>);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const previousPreferences = savedPreferences;

    try {
      const response = await fetch("/api/settings/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as PreferencesApiResponse;

      if (!response.ok) {
        updateGlobalPreferences(previousPreferences);
        toast.error(result.message ?? t("settings.preference.errSave" as never));
        return;
      }

      const nextPreferences = result.preferences ?? form;
      setSavedPreferences(nextPreferences);
      setForm(nextPreferences);
      updateGlobalPreferences(nextPreferences);

      toast.success(result.message ?? t("settings.preference.successSave" as never));
    } catch {
      updateGlobalPreferences(previousPreferences);
      toast.error(t("settings.preference.errNetwork" as never));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsSection
      id="preferences"
      title={t("settings.preferencesTitle")}
      description={t("settings.preferencesDescription")}
      icon={Palette}
      footer={
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isSubmitting || !isDirty}
            onClick={handleSubmit}
            className="h-10 rounded-xl bg-emerald-600 px-4 text-white shadow-[0_12px_30px_-18px_rgba(5,150,105,0.9)] hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            {isSubmitting ? t("common.saving") : t("settings.savePreferences")}
          </Button>
        </div>
      }
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <PreferenceRow
          icon={form.theme === "dark" ? Moon : SunMedium}
          title={t("settings.theme")}
          description={
            form.theme === "dark"
              ? t("settings.themeDark")
              : form.theme === "light"
                ? t("settings.themeLight")
                : t("settings.themeSystem")
          }
        >
          <Select
            value={form.theme}
            onValueChange={(value) =>
              updatePreference("theme", value as ThemePreference)
            }
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white sm:w-44 dark:border-slate-700 dark:bg-slate-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-emerald-100 bg-white dark:border-slate-700 dark:bg-slate-950">
              <SelectItem value="light">
                <SunMedium className="h-4 w-4 text-amber-500" />
                {t("settings.themeLight")}
              </SelectItem>
              <SelectItem value="dark">
                <Moon className="h-4 w-4 text-slate-500" />
                {t("settings.themeDark")}
              </SelectItem>
              <SelectItem value="system">
                <Monitor className="h-4 w-4 text-emerald-600" />
                {t("settings.themeSystem")}
              </SelectItem>
            </SelectContent>
          </Select>
        </PreferenceRow>

        <PreferenceRow
          icon={Globe2}
          title={t("settings.language")}
          description={t("settings.languageDescription")}
        >
          <Select
            value={form.language}
            onValueChange={(value) =>
              updatePreference("language", value as LanguagePreference)
            }
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white sm:w-44 dark:border-slate-700 dark:bg-slate-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-emerald-100 bg-white dark:border-slate-700 dark:bg-slate-950">
              <SelectItem value="id">Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </PreferenceRow>
      </div>
    </SettingsSection>
  );
}
