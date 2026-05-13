import type { TranslationKey } from "@/lib/i18n/dictionaries";

export interface HowItWorksStep {
  id: number;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string;
}

export interface Feature {
  id: number;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string;
  color: string;
}

export interface LeaderboardUser {
  id: number;
  rank: number;
  name: string;
  points: number;
  avatar: string;
}

export interface ImpactStat {
  id: number;
  labelKey: TranslationKey;
  value: number;
  suffix: string;
  icon: string;
  color: string;
}

export interface FloatingIconConfig {
  id: string;
  icon: string;
  delay: number;
  duration: number;
  x: number;
  y: number;
}
