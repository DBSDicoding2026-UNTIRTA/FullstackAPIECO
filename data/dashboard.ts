import type {
  ChallengeItem,
  DashboardStatItem,
  DashboardUser,
  LeaderboardEntry,
  UserBadge,
} from "@/types";

export const DASHBOARD_USER: DashboardUser = {
  name: "Dafa Rizqy",
  points: 320,
  level: 5,
  recycledItems: 24,
  activeBadge: "Eco Beginner",
};

export const DASHBOARD_STATS: ReadonlyArray<DashboardStatItem> = [
  {
    id: "points",
    label: "Total Poin",
    value: String(DASHBOARD_USER.points),
    caption: "+40 minggu ini",
    icon: "⭐",
    tone: "emerald",
  },
  {
    id: "level",
    label: "Level",
    value: String(DASHBOARD_USER.level),
    caption: "Teruskan streak harian",
    icon: "📈",
    tone: "sky",
  },
  {
    id: "recycled",
    label: "Sampah Dipilah",
    value: String(DASHBOARD_USER.recycledItems),
    caption: "5 item hari ini",
    icon: "♻️",
    tone: "amber",
  },
  {
    id: "badge",
    label: "Badge Aktif",
    value: DASHBOARD_USER.activeBadge,
    caption: "Badge berikutnya: Eco Pro",
    icon: "🏅",
    tone: "violet",
  },
] as const;

export const WEEKLY_CHALLENGES: ReadonlyArray<ChallengeItem> = [
  {
    id: "plastic-10",
    title: "Kumpulkan 10 item plastik",
    current: 6,
    target: 10,
    icon: "🧴",
  },
  {
    id: "daily-streak-7",
    title: "Streak 7 hari upload",
    current: 4,
    target: 7,
    icon: "🔥",
  },
  {
    id: "points-500",
    title: "Capai 500 poin pekan ini",
    current: 320,
    target: 500,
    icon: "⚡",
  },
] as const;

export const LEADERBOARD_MINI: ReadonlyArray<LeaderboardEntry> = [
  { id: "lb-1", rank: 1, name: "Nadia Putri", points: 540 },
  { id: "lb-2", rank: 2, name: "Dafa Rizqy", points: 320, isCurrentUser: true },
  { id: "lb-3", rank: 3, name: "Rafi Kurniawan", points: 280 },
] as const;

export const USER_BADGES: ReadonlyArray<UserBadge> = [
  {
    id: "badge-eco-beginner",
    name: "Eco Beginner",
    description: "Menyelesaikan 20 upload pertama.",
    icon: "🌱",
    unlocked: true,
  },
  {
    id: "badge-plastic-hunter",
    name: "Plastic Hunter",
    description: "Mengumpulkan 50 item plastik.",
    icon: "♻️",
    unlocked: false,
  },
  {
    id: "badge-consistency",
    name: "Consistency Keeper",
    description: "Streak 14 hari berturut-turut.",
    icon: "🏆",
    unlocked: false,
  },
] as const;
