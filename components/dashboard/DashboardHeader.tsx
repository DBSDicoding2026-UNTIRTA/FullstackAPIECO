import type { DashboardUser } from "@/types";

interface DashboardHeaderProps {
  readonly user: DashboardUser;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="rounded-3xl bg-linear-to-r from-emerald-500 to-lime-500 p-6 text-white sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Halo, {user.name} 👋</h1>
      <p className="mt-2 text-sm text-emerald-50 sm:text-base">
        Terima kasih sudah menjaga lingkungan. Lanjutkan progresmu hari ini.
      </p>
    </header>
  );
}
