import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import DashboardShell from "../../components/dashboard/DashboardShell";
import BadgeCard from "@/components/dashboard/BadgeCard";
import ChallengeProgress from "@/components/dashboard/ChallengeProgress";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LeaderboardMini from "@/components/dashboard/LeaderboardMini";
import StatCard from "@/components/dashboard/StatCard";
import UploadCard from "@/components/dashboard/UploadCard";
import AppLogo from "@/components/shared/AppLogo";
import Container from "@/components/shared/Container";
import { authOptions } from "@/lib/auth";
import {
  DASHBOARD_STATS,
  DASHBOARD_USER,
  LEADERBOARD_MINI,
  USER_BADGES,
  WEEKLY_CHALLENGES,
} from "@/data/dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // TODO: profile completion nanti.
  // TODO: update umur nanti.
  // TODO: integrasi statistik user nanti.
  const dashboardUser = {
    ...DASHBOARD_USER,
    name: session.user?.name ?? DASHBOARD_USER.name,
  };

  return (
    <DashboardShell>
      <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/90 backdrop-blur-sm">
        <Container className="flex items-center justify-between py-4">
          <AppLogo href="/" />
          <Link
            href="/login"
            className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Ganti Akun
          </Link>
        </Container>
      </header>

      <Container className="relative z-10 space-y-6 py-6 sm:py-8 lg:space-y-7">
        <DashboardHeader user={dashboardUser} />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_STATS.map((item, index) => (
            <StatCard key={item.id} item={item} index={index} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <UploadCard />
            <ChallengeProgress items={WEEKLY_CHALLENGES} />
          </div>
          <LeaderboardMini entries={LEADERBOARD_MINI} />
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_14px_34px_-24px_rgba(16,185,129,0.45)] sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Badge Saya</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {USER_BADGES.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} index={index} />
            ))}
          </div>
        </section>
      </Container>
    </DashboardShell>
  );
}
