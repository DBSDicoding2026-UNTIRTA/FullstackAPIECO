import type { Role } from "@/lib/generated/prisma/client";

export type ThemePreference = "light" | "dark" | "system";
export type LanguagePreference = "id" | "en";

export interface SettingsProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

export interface SettingsPreferences {
  theme: ThemePreference;
  language: LanguagePreference;
}

export interface SettingsSecurity {
  createdAt: string;
  lastLoginAt: string | null;
  loginProviders: string[];
  activeSession: {
    strategy: string;
    expires: string | null;
    status: string;
  };
  canChangePassword: boolean;
}

export interface SettingsUser {
  id: string;
  role: Role;
  profile: SettingsProfile;
  preferences: SettingsPreferences;
  security: SettingsSecurity;
}

export interface GlobalSettings {
  userId: string | null;
  role: Role | null;
  profile: SettingsProfile;
  preferences: SettingsPreferences;
}

export type SettingsFieldErrors<T extends string = string> = Partial<
  Record<T, string>
>;
