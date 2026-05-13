import type {
  GlobalSettings,
  LanguagePreference,
  SettingsPreferences,
  ThemePreference,
} from "@/types/settings";

export const DEFAULT_THEME: ThemePreference = "system";
export const DEFAULT_LANGUAGE: LanguagePreference = "id";

export const defaultPreferences: SettingsPreferences = {
  theme: DEFAULT_THEME,
  language: DEFAULT_LANGUAGE,
};

export const guestSettings: GlobalSettings = {
  userId: null,
  role: null,
  profile: {
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
  },
  preferences: defaultPreferences,
};

export function normalizeTheme(value: string | null | undefined): ThemePreference {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return DEFAULT_THEME;
}

export function normalizeLanguage(
  value: string | null | undefined,
): LanguagePreference {
  return value === "en" ? "en" : DEFAULT_LANGUAGE;
}

