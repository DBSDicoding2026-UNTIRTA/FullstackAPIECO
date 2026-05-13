"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { translate, type TranslationKey } from "@/lib/i18n/dictionaries";
import { guestSettings } from "@/lib/settings/defaults";
import type {
  GlobalSettings,
  LanguagePreference,
  SettingsPreferences,
  SettingsProfile,
  ThemePreference,
} from "@/types/settings";

type ResolvedTheme = "light" | "dark";

interface SettingsContextValue {
  settings: GlobalSettings;
  profile: SettingsProfile;
  preferences: SettingsPreferences;
  theme: ThemePreference;
  language: LanguagePreference;
  isAuthenticated: boolean;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: LanguagePreference) => void;
  updateProfile: (profile: Partial<SettingsProfile>) => void;
  updatePreferences: (preferences: Partial<SettingsPreferences>) => void;
  replaceSettings: (settings: GlobalSettings) => void;

}

const SETTINGS_BROADCAST = "pilahyuk.settings";
const SettingsContext = createContext<SettingsContextValue | null>(null);

function resolveTheme(theme: ThemePreference): ResolvedTheme {
  if (theme !== "system") {
    return theme;
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function applyTheme(theme: ThemePreference) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themePreference = theme;
  document.documentElement.style.colorScheme = resolvedTheme;
}

function storePreference<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can be blocked; database remains the source of truth.
  }
}

export function SettingsProvider({
  children,
  initialSettings,
}: {
  readonly children: ReactNode;
  readonly initialSettings: GlobalSettings | null;
}) {
  const [settings, setSettings] = useState<GlobalSettings>(
    initialSettings ?? guestSettings,
  );
  const settingsRef = useRef(settings);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  const replaceSettings = useCallback((nextSettings: GlobalSettings) => {
    settingsRef.current = nextSettings;
    setSettings(nextSettings);
  }, []);

  const broadcastSettings = useCallback((nextSettings: GlobalSettings) => {
    broadcastRef.current?.postMessage(nextSettings);
  }, []);

  const commitSettings = useCallback(
    (
      updater:
        | GlobalSettings
        | ((currentSettings: GlobalSettings) => GlobalSettings),
      options: { broadcast?: boolean } = { broadcast: true },
    ) => {
      const currentSettings = settingsRef.current;
      const nextSettings =
        typeof updater === "function" ? updater(currentSettings) : updater;

      settingsRef.current = nextSettings;
      setSettings(nextSettings);

      if (options.broadcast !== false) {
        broadcastSettings(nextSettings);
      }
    },
    [broadcastSettings],
  );

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    applyTheme(settings.preferences.theme);
    storePreference("pilahyuk-theme", settings.preferences.theme);
  }, [settings.preferences.theme]);

  useEffect(() => {
    storePreference("pilahyuk-language", settings.preferences.language);
    document.documentElement.lang = settings.preferences.language;
  }, [settings.preferences.language]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel = new BroadcastChannel(SETTINGS_BROADCAST);
    broadcastRef.current = channel;
    channel.onmessage = (event: MessageEvent<GlobalSettings>) => {
      settingsRef.current = event.data;
      setSettings(event.data);
    };

    return () => {
      channel.close();
      broadcastRef.current = null;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (settingsRef.current.preferences.theme === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  const updateProfile = useCallback(
    (profile: Partial<SettingsProfile>) => {
      commitSettings((currentSettings) => ({
        ...currentSettings,
        profile: {
          ...currentSettings.profile,
          ...profile,
        },
      }));
    },
    [commitSettings],
  );

  const updatePreferences = useCallback(
    (preferences: Partial<SettingsPreferences>) => {
      commitSettings((currentSettings) => ({
        ...currentSettings,
        preferences: {
          ...currentSettings.preferences,
          ...preferences,
        },
      }));
    },
    [commitSettings],
  );

  const setTheme = useCallback(
    (theme: ThemePreference) => {
      updatePreferences({ theme });
    },
    [updatePreferences],
  );

  const setLanguage = useCallback(
    (language: LanguagePreference) => {
      updatePreferences({ language });
    },
    [updatePreferences],
  );



  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      profile: settings.profile,
      preferences: settings.preferences,
      theme: settings.preferences.theme,
      language: settings.preferences.language,
      isAuthenticated: Boolean(settings.userId),
      t: (key, values) => translate(settings.preferences.language, key, values),
      setTheme,
      setLanguage,
      updateProfile,
      updatePreferences,
      replaceSettings,
    }),
    [
      replaceSettings,
      setLanguage,
      setTheme,
      settings,
      updatePreferences,
      updateProfile,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider.");
  }

  return context;
}

export function useTheme() {
  const { theme, setTheme } = useSettings();
  return { theme, setTheme, resolvedTheme: resolveTheme(theme) };
}

export function useLanguage() {
  const { language, setLanguage, t } = useSettings();
  return { language, setLanguage, t };
}

