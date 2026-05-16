import "server-only";

import { getDashboardData } from "@/data/dashboard";
import type { DashboardMetrics } from "@/data/dashboard";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import prisma from "@/lib/prisma";
import type { LeaderboardEntry } from "@/types";

type Translator = (key: TranslationKey, values?: Record<string, string | number>) => string;

interface GetUserDashboardDataOptions {
  readonly userId: string;
  readonly fallbackName?: string | null;
  readonly t: Translator;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const STREAK_LOOKBACK_DAYS = 30;

function startOfLocalDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateUploadStreak(uploadDates: ReadonlyArray<Date>) {
  const uploadDateKeys = new Set(uploadDates.map(toDateKey));
  let cursor = startOfLocalDay(new Date());

  if (!uploadDateKeys.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;

  while (uploadDateKeys.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function getDisplayName(user: {
  readonly name: string | null;
  readonly username: string | null;
  readonly email: string;
}, fallbackName?: string | null) {
  return (
    user.name ||
    user.username ||
    fallbackName ||
    user.email.split("@")[0] ||
    "User"
  );
}

function mapLeaderboardUser(
  user: {
    readonly id: string;
    readonly name: string | null;
    readonly username: string | null;
    readonly email: string;
    readonly points: number;
  },
  rank: number,
  currentUserId: string,
): LeaderboardEntry {
  return {
    id: user.id,
    rank,
    name: getDisplayName(user),
    points: user.points,
    isCurrentUser: user.id === currentUserId,
  };
}

function buildLeaderboard(
  topUsers: ReadonlyArray<{
    readonly id: string;
    readonly name: string | null;
    readonly username: string | null;
    readonly email: string;
    readonly points: number;
  }>,
  currentUser: {
    readonly id: string;
    readonly name: string | null;
    readonly username: string | null;
    readonly email: string;
    readonly points: number;
  },
  currentUserRank: number,
) {
  const topEntries = topUsers.map((user, index) =>
    mapLeaderboardUser(user, index + 1, currentUser.id),
  );

  if (topEntries.some((entry) => entry.isCurrentUser)) {
    return topEntries;
  }

  const currentUserEntry = mapLeaderboardUser(
    currentUser,
    currentUserRank,
    currentUser.id,
  );

  return [...topEntries.slice(0, 2), currentUserEntry];
}

export async function getUserDashboardData({
  userId,
  fallbackName,
  t,
}: GetUserDashboardDataOptions) {
  const now = new Date();
  const todayStart = startOfLocalDay(now);
  const weekAgo = new Date(now.getTime() - 7 * DAY_IN_MS);
  const streakStart = addDays(todayStart, -STREAK_LOOKBACK_DAYS);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      points: true,
      level: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const [
    totalUploads,
    uploadsToday,
    plasticUploads,
    recentUploads,
    weeklyPointAggregate,
    correctQuizQuestions,
    topUsers,
    higherPointUsers,
  ] = await Promise.all([
    prisma.aIAnalysisHistory.count({
      where: {
        userId: user.id,
      },
    }),
    prisma.aIAnalysisHistory.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: todayStart,
        },
      },
    }),
    prisma.aIAnalysisHistory.count({
      where: {
        userId: user.id,
        result: {
          in: ["Plastik", "plastik", "PLASTIK"],
        },
      },
    }),
    prisma.aIAnalysisHistory.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: streakStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    }),
    prisma.quizAttempt.aggregate({
      where: {
        userId: user.id,
        createdAt: {
          gte: weekAgo,
        },
      },
      _sum: {
        pointsEarned: true,
      },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId: user.id,
        isCorrect: true,
      },
      distinct: ["questionId"],
      select: {
        questionId: true,
      },
    }),
    prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: [{ points: "desc" }, { createdAt: "asc" }],
      take: 3,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        points: true,
      },
    }),
    prisma.user.count({
      where: {
        role: "USER",
        points: {
          gt: user.points,
        },
      },
    }),
  ]);

  const metrics: DashboardMetrics = {
    name: getDisplayName(user, fallbackName),
    points: user.points,
    level: user.level,
    totalUploads,
    uploadsToday,
    weeklyPoints: weeklyPointAggregate._sum.pointsEarned ?? 0,
    uploadStreak: calculateUploadStreak(
      recentUploads.map((upload) => upload.createdAt),
    ),
    plasticUploads,
    correctQuizAnswers: correctQuizQuestions.length,
    leaderboard: buildLeaderboard(topUsers, user, higherPointUsers + 1),
  };

  return getDashboardData(t, metrics);
}
