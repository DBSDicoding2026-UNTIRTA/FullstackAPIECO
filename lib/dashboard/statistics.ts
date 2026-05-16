import "server-only";

import prisma from "@/lib/prisma";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const CHART_DAYS = 14;

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

function formatShortDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function normalizeWasteType(value: string) {
  return value.trim().toLowerCase();
}

function getWasteLabel(value: string) {
  const normalized = normalizeWasteType(value);

  if (!normalized) return "Lainnya";

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function toPercent(value: number, total: number) {
  if (total <= 0) return 0;

  return Math.round((value / total) * 100);
}

export async function getUserStatisticsData(userId: string, locale: string) {
  const now = new Date();
  const todayStart = startOfLocalDay(now);
  const chartStart = addDays(todayStart, -(CHART_DAYS - 1));
  const weekStart = addDays(todayStart, -6);
  const previousWeekStart = addDays(weekStart, -7);

  const [
    user,
    uploads,
    wasteGroups,
    uploadConfidence,
    quizAttempts,
    correctQuestionAttempts,
    modules,
    recentUploads,
    recentQuizAttempts,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        points: true,
        level: true,
      },
    }),
    prisma.aIAnalysisHistory.findMany({
      where: {
        userId,
        createdAt: {
          gte: previousWeekStart,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        result: true,
        confidence: true,
        createdAt: true,
      },
    }),
    prisma.aIAnalysisHistory.groupBy({
      by: ["result"],
      where: {
        userId,
      },
      _count: {
        result: true,
      },
      orderBy: {
        _count: {
          result: "desc",
        },
      },
    }),
    prisma.aIAnalysisHistory.aggregate({
      where: {
        userId,
      },
      _avg: {
        confidence: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId,
        createdAt: {
          gte: previousWeekStart,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        isCorrect: true,
        pointsEarned: true,
        createdAt: true,
      },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId,
        isCorrect: true,
      },
      distinct: ["questionId"],
      select: {
        questionId: true,
      },
    }),
    prisma.quizModule.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        order: true,
        quizzes: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.aIAnalysisHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        result: true,
        confidence: true,
        createdAt: true,
      },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        isCorrect: true,
        pointsEarned: true,
        selectedAnswer: true,
        correctAnswer: true,
        createdAt: true,
        question: {
          select: {
            question: true,
            module: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  const correctQuestionIds = new Set(
    correctQuestionAttempts.map((attempt) => attempt.questionId),
  );
  const completedModules = modules.filter(
    (moduleRecord) =>
      moduleRecord.quizzes.length > 0 &&
      moduleRecord.quizzes.every((quiz) => correctQuestionIds.has(quiz.id)),
  );

  const chartPoints = Array.from({ length: CHART_DAYS }, (_, index) => {
    const date = addDays(chartStart, index);
    const key = toDateKey(date);

    return {
      key,
      label: formatShortDate(date, locale),
      uploads: 0,
      quizXp: 0,
      quizAttempts: 0,
    };
  });
  const chartByKey = new Map(chartPoints.map((point) => [point.key, point]));

  for (const upload of uploads) {
    const point = chartByKey.get(toDateKey(upload.createdAt));

    if (point) {
      point.uploads += 1;
    }
  }

  for (const attempt of quizAttempts) {
    const point = chartByKey.get(toDateKey(attempt.createdAt));

    if (point) {
      point.quizXp += attempt.pointsEarned;
      point.quizAttempts += 1;
    }
  }

  const uploadsThisWeek = uploads.filter(
    (upload) => upload.createdAt >= weekStart,
  ).length;
  const uploadsPreviousWeek = uploads.filter(
    (upload) => upload.createdAt >= previousWeekStart && upload.createdAt < weekStart,
  ).length;
  const quizAttemptsThisWeek = quizAttempts.filter(
    (attempt) => attempt.createdAt >= weekStart,
  );
  const quizXpThisWeek = quizAttemptsThisWeek.reduce(
    (total, attempt) => total + attempt.pointsEarned,
    0,
  );
  const correctQuizThisWeek = quizAttemptsThisWeek.filter(
    (attempt) => attempt.isCorrect,
  ).length;
  const accuracyThisWeek = toPercent(correctQuizThisWeek, quizAttemptsThisWeek.length);
  const totalWaste = wasteGroups.reduce(
    (total, group) => total + group._count.result,
    0,
  );
  const totalQuestions = modules.reduce(
    (total, moduleRecord) => total + moduleRecord.quizzes.length,
    0,
  );

  const moduleProgress = modules.map((moduleRecord) => {
    const total = moduleRecord.quizzes.length;
    const completed = moduleRecord.quizzes.filter((quiz) =>
      correctQuestionIds.has(quiz.id),
    ).length;

    return {
      id: moduleRecord.id,
      title: moduleRecord.title,
      order: moduleRecord.order,
      completed,
      total,
      progressPercent: toPercent(completed, total),
    };
  });

  const recentActivities = [
    ...recentUploads.map((upload) => ({
      id: `upload-${upload.id}`,
      type: "upload" as const,
      result: getWasteLabel(upload.result),
      confidence: upload.confidence,
      createdAt: upload.createdAt,
      accent: "AI",
    })),
    ...recentQuizAttempts.map((attempt) => ({
      id: `quiz-${attempt.id}`,
      type: "quiz" as const,
      isCorrect: attempt.isCorrect,
      moduleTitle: attempt.question.module.title,
      pointsEarned: attempt.pointsEarned,
      createdAt: attempt.createdAt,
      accent: attempt.isCorrect ? "OK" : "X",
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return {
    user: {
      name: user.name || user.username || user.email.split("@")[0],
      points: user.points,
      level: user.level,
    },
    summary: {
      totalUploads: uploadConfidence._count.id,
      uploadsThisWeek,
      uploadsPreviousWeek,
      avgConfidence: uploadConfidence._avg.confidence ?? 0,
      quizXpThisWeek,
      quizAttemptsThisWeek: quizAttemptsThisWeek.length,
      accuracyThisWeek,
      uniqueCorrectQuestions: correctQuestionIds.size,
      totalQuestions,
      completedModules: completedModules.length,
      totalModules: modules.length,
    },
    chartPoints,
    wasteDistribution: wasteGroups.map((group) => ({
      type: getWasteLabel(group.result),
      count: group._count.result,
      percent: toPercent(group._count.result, totalWaste),
    })),
    moduleProgress,
    recentActivities,
  };
}
