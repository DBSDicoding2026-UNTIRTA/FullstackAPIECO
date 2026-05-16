import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";
import AppShell from "@/components/shared/AppShell";
import AppNavbar from "@/components/shared/AppNavbar";
import Container from "@/components/shared/Container";
import StatsHeroHeader from "@/components/dashboard/statistics/StatsHeroHeader";
import StatsSummaryCards from "@/components/dashboard/statistics/StatsSummaryCards";
import TrendChart from "@/components/dashboard/statistics/TrendChart";
import WasteDonutChart from "@/components/dashboard/statistics/WasteDonutChart";
import ModuleProgressList from "@/components/dashboard/statistics/ModuleProgressList";
import AchievementPanel from "@/components/dashboard/statistics/AchievementPanel";
import ActivityTimeline from "@/components/dashboard/statistics/ActivityTimeline";
import { getUserStatisticsData } from "@/lib/dashboard/statistics";
import { translate, type TranslationKey } from "@/lib/i18n/dictionaries";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { requireUser } from "@/lib/user-auth";

type Translator = (key: TranslationKey, values?: Record<string, string | number>) => string;

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function formatDateTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getWasteDisplayName(type: string, t: Translator) {
  const normalized = type.trim().toLowerCase();
  const keyByType: Record<string, TranslationKey> = {
    kaca: "waste.glass",
    glass: "waste.glass",
    kertas: "waste.paper",
    logam: "waste.metal",
    metal: "waste.metal",
    organic: "waste.organic",
    organik: "waste.organic",
    paper: "waste.paper",
    plastik: "waste.plastic",
    plastic: "waste.plastic",
  };
  const key = keyByType[normalized];
  return key ? t(key) : type;
}

function getTrendLabel(current: number, previous: number, locale: string, t: Translator) {
  const difference = current - previous;
  if (difference === 0) return t("dashboard.statistics.trendStable");
  if (difference > 0) return t("dashboard.statistics.trendUp", { count: formatNumber(difference, locale) });
  return t("dashboard.statistics.trendDown", { count: formatNumber(Math.abs(difference), locale) });
}

export default async function UserStatisticsPage() {
  const session = await requireUser();
  const userId = session.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const settings = await getGlobalSettingsForSession(session);
  const locale = settings.preferences.language === "en" ? "en-US" : "id-ID";
  const t: Translator = (key, values) => translate(settings.preferences.language, key, values);
  const data = await getUserStatisticsData(userId, locale);

  const quizCompletionPercent =
    data.summary.totalQuestions > 0
      ? Math.round((data.summary.uniqueCorrectQuestions / data.summary.totalQuestions) * 100)
      : 0;

  const navbarUser = {
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    role: session.user?.role ?? "USER",
  };

  // Prepare stat summary items (use string keys for icons — resolved inside client component)
  const statItems = [
    {
      iconKey: "recycle" as const,
      label: t("dashboard.statistics.uploadsLabel"),
      value: formatNumber(data.summary.totalUploads, locale),
      rawValue: data.summary.totalUploads,
      caption: getTrendLabel(data.summary.uploadsThisWeek, data.summary.uploadsPreviousWeek, locale, t),
      gradient: "bg-emerald-400",
      iconGradient: "bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700 dark:from-emerald-950/60 dark:to-lime-950/40 dark:text-emerald-300",
    },
    {
      iconKey: "gauge" as const,
      label: t("dashboard.statistics.confidenceLabel"),
      value: formatPercent(data.summary.avgConfidence * 100),
      rawValue: Math.round(data.summary.avgConfidence * 100),
      caption: t("dashboard.statistics.confidenceCaption"),
      gradient: "bg-sky-400",
      iconGradient: "bg-gradient-to-br from-sky-100 to-teal-100 text-sky-700 dark:from-sky-950/60 dark:to-teal-950/40 dark:text-sky-300",
    },
    {
      iconKey: "zap" as const,
      label: t("dashboard.statistics.quizXpLabel"),
      value: formatNumber(data.summary.quizXpThisWeek, locale),
      rawValue: data.summary.quizXpThisWeek,
      caption: t("dashboard.statistics.quizXpCaption", { count: formatNumber(data.summary.quizAttemptsThisWeek, locale) }),
      gradient: "bg-amber-400",
      iconGradient: "bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-950/60 dark:to-yellow-950/40 dark:text-amber-300",
    },
    {
      iconKey: "target" as const,
      label: t("dashboard.statistics.quizAccuracyLabel"),
      value: formatPercent(data.summary.accuracyThisWeek),
      rawValue: data.summary.accuracyThisWeek,
      caption: t("dashboard.statistics.quizAccuracyCaption", {
        current: formatNumber(data.summary.uniqueCorrectQuestions, locale),
        total: formatNumber(data.summary.totalQuestions, locale),
      }),
      gradient: "bg-violet-400",
      iconGradient: "bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700 dark:from-violet-950/60 dark:to-purple-950/40 dark:text-violet-300",
    },
  ];

  // Prepare chart points for client (pre-format tooltip labels on server)
  const chartPoints = data.chartPoints.map((p) => ({
    key: p.key,
    label: p.label,
    uploads: p.uploads,
    quizXp: p.quizXp,
    uploadLabel: t("dashboard.statistics.uploadCount", { count: p.uploads }),
    quizXpLabel: t("dashboard.statistics.quizXpCount", { points: p.quizXp }),
  }));

  // Prepare waste distribution for client (pre-format count labels on server)
  const wasteItems = data.wasteDistribution.map((item) => ({
    type: getWasteDisplayName(item.type, t),
    count: item.count,
    percent: item.percent,
    countLabel: t("dashboard.statistics.itemCount", { count: item.count, percent: item.percent }),
  }));

  // Prepare activities for client
  const activities = data.recentActivities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    headline:
      activity.type === "upload"
        ? t("dashboard.statistics.activityUpload", { type: getWasteDisplayName(activity.result, t) })
        : activity.isCorrect
          ? t("dashboard.statistics.activityQuizCorrect")
          : t("dashboard.statistics.activityQuizWrong"),
    detail:
      activity.type === "upload"
        ? t("dashboard.statistics.activityUploadDetail", { confidence: (activity.confidence * 100).toFixed(1) })
        : t("dashboard.statistics.activityQuizDetail", { module: activity.moduleTitle, points: activity.pointsEarned }),
    timestamp: formatDateTime(activity.createdAt, locale),
    accent: activity.accent,
    isCorrect: activity.type === "quiz" ? activity.isCorrect : undefined,
  }));

  return (
    <AppShell variant="user">
      <DashboardShell>
        <AppNavbar user={navbarUser} />

        <Container className="relative z-10 space-y-6 py-6 sm:py-8 lg:space-y-7">
          {/* Hero Header */}
          <StatsHeroHeader
            badge={t("dashboard.statistics.badge")}
            title={t("dashboard.statistics.title", { name: data.user.name })}
            subtitle={t("dashboard.statistics.subtitle")}
            pointsLabel={t("dashboard.totalPoints")}
            levelLabel={t("dashboard.level")}
            points={formatNumber(data.user.points, locale)}
            level={data.user.level}
          />

          {/* Summary Cards */}
          <StatsSummaryCards items={statItems} />

          {/* Charts Row */}
          <section className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
            <TrendChart
              title={t("dashboard.statistics.trendTitle")}
              subtitle={t("dashboard.statistics.trendSubtitle")}
              uploadLegend={t("common.upload")}
              quizXpLegend={t("dashboard.statistics.quizXpLegend")}
              points={chartPoints}
            />
            <WasteDonutChart
              title={t("dashboard.statistics.distributionTitle")}
              subtitle={t("dashboard.statistics.distributionSubtitle")}
              emptyMessage={t("dashboard.statistics.emptyClassification")}
              totalLabel={t("dashboard.statistics.totalLabel")}
              items={wasteItems}
            />
          </section>

          {/* Module Progress & Achievement */}
          <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
            <ModuleProgressList
              title={t("dashboard.statistics.moduleProgressTitle")}
              subtitle={t("dashboard.statistics.moduleProgressSubtitle")}
              completedBadge={t("dashboard.statistics.completedPercent", { percent: quizCompletionPercent })}
              modules={data.moduleProgress}
            />
            <AchievementPanel
              title={t("dashboard.statistics.achievementTitle")}
              quizMasteryLabel={t("dashboard.statistics.quizMastery")}
              completedModulesLabel={t("dashboard.statistics.completedModules")}
              completedModules={data.summary.completedModules}
              totalModules={data.summary.totalModules}
              masteredQuestionsLabel={t("dashboard.statistics.masteredQuestions")}
              masteredQuestions={data.summary.uniqueCorrectQuestions}
              totalQuestions={data.summary.totalQuestions}
              weeklyQualityLabel={t("dashboard.statistics.weeklyQuality")}
              weeklyQualityMessage={data.summary.accuracyThisWeek >= 80 ? t("dashboard.statistics.qualityGood") : t("dashboard.statistics.qualityImprove")}
              isGoodQuality={data.summary.accuracyThisWeek >= 80}
              quizCompletionPercent={quizCompletionPercent}
            />
          </section>

          {/* Activity Timeline */}
          <ActivityTimeline
            title={t("dashboard.statistics.recentTitle")}
            emptyMessage={t("dashboard.statistics.emptyActivity")}
            activities={activities}
          />
        </Container>
      </DashboardShell>
    </AppShell>
  );
}
