import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import DashboardShell from "../../components/dashboard/DashboardShell";
import BadgeCard from "@/components/dashboard/BadgeCard";
import ChallengeProgress from "@/components/dashboard/ChallengeProgress";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LeaderboardMini from "@/components/dashboard/LeaderboardMini";
import StatCard from "@/components/dashboard/StatCard";
import UploadCard from "@/components/dashboard/UploadCard";
import AppNavbar from "@/components/shared/AppNavbar";
import Container from "@/components/shared/Container";
import { authOptions } from "@/lib/auth";
import { DASHBOARD_USER, getDashboardData } from "@/data/dashboard";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { translate } from "@/lib/i18n/dictionaries";

import AppShell from "@/components/shared/AppShell";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role === "ADMIN") {
    redirect("/admin");
  }

  const settings = await getGlobalSettingsForSession(session);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(settings.preferences.language, key, values);
  const { stats, challenges, leaderboard, badges } = getDashboardData(t);

  // TODO: profile completion nanti.
  // TODO: update umur nanti.
  // TODO: integrasi statistik user nanti.
  const dashboardUser = {
    ...DASHBOARD_USER,
    name: session.user?.name ?? DASHBOARD_USER.name,
  };

  const navbarUser = {
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    role: session.user?.role ?? "USER",
  };

  return (
    <AppShell variant="user">
      <DashboardShell>
        <AppNavbar user={navbarUser} />

        <Container className="relative z-10 space-y-6 py-6 sm:py-8 lg:space-y-7">
          <DashboardHeader user={dashboardUser} />

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <StatCard key={item.id} item={item} index={index} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <UploadCard />
              <ChallengeProgress items={challenges} />
            </div>
            <LeaderboardMini entries={leaderboard} />
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_14px_34px_-24px_rgba(16,185,129,0.45)] sm:p-6 dark:border-emerald-900/60 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t("dashboard.badgesTitle")}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge, index) => (
                <BadgeCard key={badge.id} badge={badge} index={index} />
              ))}
            </div>
          </section>
        </Container>
      </DashboardShell>
    </AppShell>
  );
}
