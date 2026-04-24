import Link from "next/link";

import BadgeCard from "@/components/dashboard/BadgeCard";
import ChallengeProgress from "@/components/dashboard/ChallengeProgress";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LeaderboardMini from "@/components/dashboard/LeaderboardMini";
import StatCard from "@/components/dashboard/StatCard";
import UploadCard from "@/components/dashboard/UploadCard";
import AppLogo from "@/components/shared/AppLogo";
import Container from "@/components/shared/Container";
import {
  DASHBOARD_STATS,
  DASHBOARD_USER,
  LEADERBOARD_MINI,
  USER_BADGES,
  WEEKLY_CHALLENGES,
} from "@/data/dashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-white via-emerald-50 to-lime-50">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <Container className="flex items-center justify-between py-4">
          <AppLogo href="/" />
          <Link
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            Ganti Akun
          </Link>
        </Container>
      </header>

      <Container className="space-y-6 py-6 sm:py-8">
        <DashboardHeader user={DASHBOARD_USER} />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_STATS.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <UploadCard />
            <ChallengeProgress items={WEEKLY_CHALLENGES} />
          </div>
          <LeaderboardMini entries={LEADERBOARD_MINI} />
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Badge Saya</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {USER_BADGES.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
