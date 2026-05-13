import type {
  ChallengeItem,
  DashboardStatItem,
  DashboardUser,
  LeaderboardEntry,
  UserBadge,
} from "@/types";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

type Translator = (key: TranslationKey, values?: Record<string, string | number>) => string;

export const DASHBOARD_USER: DashboardUser = {
  name: "Dafa Rizqy",
  points: 320,
  level: 5,
  recycledItems: 24,
  activeBadge: "Eco Beginner",
};

export function getDashboardData(t: Translator): {
  stats: ReadonlyArray<DashboardStatItem>;
  challenges: ReadonlyArray<ChallengeItem>;
  leaderboard: ReadonlyArray<LeaderboardEntry>;
  badges: ReadonlyArray<UserBadge>;
} {
  const stats: ReadonlyArray<DashboardStatItem> = [
    {
      id: "points",
      label: t("dashboard.totalPoints"),
      value: String(DASHBOARD_USER.points),
      caption: t("dashboard.stats.pointsCaption"),
      icon: "⭐",
      tone: "emerald",
    },
    {
      id: "level",
      label: t("dashboard.level"),
      value: String(DASHBOARD_USER.level),
      caption: t("dashboard.stats.levelCaption"),
      icon: "📈",
      tone: "sky",
    },
    {
      id: "recycled",
      label: t("dashboard.stats.recycledLabel"),
      value: String(DASHBOARD_USER.recycledItems),
      caption: t("dashboard.stats.recycledCaption"),
      icon: "♻️",
      tone: "amber",
    },
    {
      id: "badge",
      label: t("dashboard.stats.badgeLabel"),
      value: DASHBOARD_USER.activeBadge,
      caption: t("dashboard.stats.badgeCaption"),
      icon: "🏅",
      tone: "violet",
    },
  ] as const;

  const challenges: ReadonlyArray<ChallengeItem> = [
    {
      id: "plastic-10",
      title: t("dashboard.challenge.plastic10"),
      current: 6,
      target: 10,
      icon: "🧴",
    },
    {
      id: "daily-streak-7",
      title: t("dashboard.challenge.streak7"),
      current: 4,
      target: 7,
      icon: "🔥",
    },
    {
      id: "points-500",
      title: t("dashboard.challenge.points500"),
      current: 320,
      target: 500,
      icon: "⚡",
    },
  ] as const;

  const leaderboard: ReadonlyArray<LeaderboardEntry> = [
    { id: "lb-1", rank: 1, name: "Nadia Putri", points: 540 },
    { id: "lb-2", rank: 2, name: "Dafa Rizqy", points: 320, isCurrentUser: true },
    { id: "lb-3", rank: 3, name: "Rafi Kurniawan", points: 280 },
  ] as const;

  const badges: ReadonlyArray<UserBadge> = [
    {
      id: "badge-eco-beginner",
      name: "Eco Beginner",
      description: t("dashboard.badge.ecoBeginner.description"),
      icon: "🌱",
      unlocked: true,
    },
    {
      id: "badge-plastic-hunter",
      name: "Plastic Hunter",
      description: t("dashboard.badge.plasticHunter.description"),
      icon: "♻️",
      unlocked: false,
    },
    {
      id: "badge-consistency",
      name: "Consistency Keeper",
      description: t("dashboard.badge.consistency.description"),
      icon: "🏆",
      unlocked: false,
    },
  ] as const;

  return { stats, challenges, leaderboard, badges };
}
