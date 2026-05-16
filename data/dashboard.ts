import type {
  ChallengeItem,
  DashboardStatItem,
  DashboardUser,
  LeaderboardEntry,
  UserBadge,
} from "@/types";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

type Translator = (key: TranslationKey, values?: Record<string, string | number>) => string;

export interface DashboardMetrics {
  readonly name: string;
  readonly points: number;
  readonly level: number;
  readonly totalUploads: number;
  readonly uploadsToday: number;
  readonly weeklyPoints: number;
  readonly uploadStreak: number;
  readonly plasticUploads: number;
  readonly correctQuizAnswers: number;
  readonly leaderboard: ReadonlyArray<LeaderboardEntry>;
}

const BADGE_RULES = [
  {
    id: "badge-xp-starter",
    name: "XP Starter",
    descriptionKey: "dashboard.badge.xpStarter.description",
    icon: "⭐",
    getCurrent: (metrics: DashboardMetrics) => metrics.points,
    target: 100,
  },
  {
    id: "badge-quiz-challenger",
    name: "Quiz Challenger",
    descriptionKey: "dashboard.badge.quizChallenger.description",
    icon: "🎯",
    getCurrent: (metrics: DashboardMetrics) => metrics.correctQuizAnswers,
    target: 10,
  },
  {
    id: "badge-eco-beginner",
    name: "Eco Beginner",
    descriptionKey: "dashboard.badge.ecoBeginner.description",
    icon: "♻️",
    getCurrent: (metrics: DashboardMetrics) => metrics.totalUploads,
    target: 5,
  },
  {
    id: "badge-consistency",
    name: "Consistency Keeper",
    descriptionKey: "dashboard.badge.consistency.description",
    icon: "🏆",
    getCurrent: (metrics: DashboardMetrics) => metrics.uploadStreak,
    target: 7,
  },
] as const;

function getActiveBadge(metrics: DashboardMetrics) {
  const unlockedBadges = BADGE_RULES.filter(
    (badge) => badge.getCurrent(metrics) >= badge.target,
  );

  return unlockedBadges.at(-1)?.name ?? "Eco Starter";
}

function getNextBadgeName(metrics: DashboardMetrics) {
  return BADGE_RULES.find((badge) => badge.getCurrent(metrics) < badge.target)?.name;
}

function toProgressPercent(current: number, target: number) {
  if (target <= 0) return 100;

  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

function getLevelProgress(points: number) {
  const pointsPerLevel = 100;
  const progressPoints = points % pointsPerLevel;

  return toProgressPercent(progressPoints, pointsPerLevel);
}

export function getDashboardData(
  t: Translator,
  metrics: DashboardMetrics,
): {
  user: DashboardUser;
  stats: ReadonlyArray<DashboardStatItem>;
  challenges: ReadonlyArray<ChallengeItem>;
  leaderboard: ReadonlyArray<LeaderboardEntry>;
  badges: ReadonlyArray<UserBadge>;
} {
  const activeBadge = getActiveBadge(metrics);
  const nextBadgeName = getNextBadgeName(metrics);
  const nextBadgeRule = BADGE_RULES.find((badge) => badge.getCurrent(metrics) < badge.target);
  const nextBadgeProgress = nextBadgeRule
    ? toProgressPercent(nextBadgeRule.getCurrent(metrics), nextBadgeRule.target)
    : 100;
  const user: DashboardUser = {
    name: metrics.name,
    points: metrics.points,
    level: metrics.level,
    recycledItems: metrics.totalUploads,
    activeBadge,
  };

  const stats: ReadonlyArray<DashboardStatItem> = [
    {
      id: "points",
      label: t("dashboard.totalPoints"),
      value: String(metrics.points),
      caption: t("dashboard.stats.pointsCaptionDynamic", {
        points: metrics.weeklyPoints,
      }),
      icon: "⭐",
      tone: "emerald",
      progressPercent: getLevelProgress(metrics.points),
    },
    {
      id: "level",
      label: t("dashboard.level"),
      value: String(metrics.level),
      caption: t("dashboard.stats.levelCaptionDynamic", {
        days: metrics.uploadStreak,
      }),
      icon: "📈",
      tone: "sky",
      progressPercent: getLevelProgress(metrics.points),
    },
    {
      id: "recycled",
      label: t("dashboard.stats.recycledLabel"),
      value: String(metrics.totalUploads),
      caption: t("dashboard.stats.recycledCaptionDynamic", {
        count: metrics.uploadsToday,
      }),
      icon: "♻️",
      tone: "amber",
      progressPercent: toProgressPercent(metrics.totalUploads, 5),
    },
    {
      id: "badge",
      label: t("dashboard.stats.badgeLabel"),
      value: activeBadge,
      caption: nextBadgeName
        ? t("dashboard.stats.badgeCaptionNext", { name: nextBadgeName })
        : t("dashboard.stats.badgeCaptionComplete"),
      icon: "🏅",
      tone: "violet",
      progressPercent: nextBadgeProgress,
    },
  ];

  const challenges: ReadonlyArray<ChallengeItem> = [
    {
      id: "plastic-10",
      title: t("dashboard.challenge.plastic10"),
      current: metrics.plasticUploads,
      target: 10,
      icon: "P",
    },
    {
      id: "daily-streak-7",
      title: t("dashboard.challenge.streak7"),
      current: metrics.uploadStreak,
      target: 7,
      icon: "7",
    },
    {
      id: "points-500",
      title: t("dashboard.challenge.points500"),
      current: metrics.weeklyPoints,
      target: 500,
      icon: "XP",
    },
  ];

  const badges: ReadonlyArray<UserBadge> = BADGE_RULES.map((badge) => {
    const current = badge.getCurrent(metrics);
    const cappedCurrent = Math.min(current, badge.target);

    return {
      id: badge.id,
      name: badge.name,
      description: t(badge.descriptionKey),
      icon: badge.icon,
      unlocked: current >= badge.target,
      current,
      target: badge.target,
      progressPercent: toProgressPercent(cappedCurrent, badge.target),
      progressLabel: `${cappedCurrent}/${badge.target}`,
    };
  });

  return {
    user,
    stats,
    challenges,
    leaderboard: metrics.leaderboard,
    badges,
  };
}
