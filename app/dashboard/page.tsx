import { redirect } from "next/navigation";

import DashboardAnimatedWrapper from "@/components/dashboard/DashboardAnimatedWrapper";
import DashboardShell from "../../components/dashboard/DashboardShell";
import BadgeCard from "@/components/dashboard/BadgeCard";
import ChallengeProgress from "@/components/dashboard/ChallengeProgress";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LeaderboardMini from "@/components/dashboard/LeaderboardMini";
import StatCard from "@/components/dashboard/StatCard";
import UploadCard from "@/components/dashboard/UploadCard";
import AppNavbar from "@/components/shared/AppNavbar";
import Container from "@/components/shared/Container";
import { getUserDashboardData } from "@/lib/dashboard/server";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { translate } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/user-auth";

import AppShell from "@/components/shared/AppShell";

export default async function DashboardPage() {
  const session = await requireUser();
  const userId = session.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const settings = await getGlobalSettingsForSession(session);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(settings.preferences.language, key, values);
  const {
    user: dashboardUser,
    stats,
    challenges,
    leaderboard,
    badges,
  } = await getUserDashboardData({
    userId,
    fallbackName: session.user?.name,
    t,
  });

  const navbarUser = {
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    role: session.user?.role ?? "USER",
  };

  return (
    <AppShell variant="user">
      <DashboardShell>
        <AppNavbar user={navbarUser} />

        <DashboardAnimatedWrapper>
          <Container className="relative z-10 space-y-5 py-6 sm:py-8 lg:space-y-6">
            <div data-dashboard-animate>
              <DashboardHeader user={dashboardUser} />
            </div>

            <section data-dashboard-animate className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item, index) => (
                <StatCard key={item.id} item={item} index={index} />
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
              <div className="space-y-5">
                <div data-dashboard-animate>
                  <UploadCard />
                </div>
                <div data-dashboard-animate>
                  <ChallengeProgress items={challenges} />
                </div>
              </div>
              <div data-dashboard-animate>
                <LeaderboardMini entries={leaderboard} />
              </div>
            </section>

            <section
              data-dashboard-animate
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                    {t("dashboard.badgesTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("dashboard.ecoProgress")}
                  </p>
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-emerald-200 to-transparent dark:from-emerald-900" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {badges.map((badge, index) => (
                  <BadgeCard key={badge.id} badge={badge} index={index} />
                ))}
              </div>
            </section>
          </Container>
        </DashboardAnimatedWrapper>
      </DashboardShell>
    </AppShell>
  );
}
