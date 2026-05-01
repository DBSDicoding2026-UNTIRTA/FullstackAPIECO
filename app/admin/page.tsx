import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Bot, FileBarChart2, ShieldCheck, Users } from "lucide-react";

import { authOptions } from "@/lib/auth";
import AppNavbar from "@/components/shared/AppNavbar";
import AppShell from "@/components/shared/AppShell";

const adminCards = [
  {
    title: "Kelola Dataset",
    description: "Atur data yang dipakai untuk evaluasi dan pelatihan model.",
    icon: FileBarChart2,
  },
  {
    title: "Kelola User",
    description: "Pantau akun pengguna, peran, dan aktivitas dasar mereka.",
    icon: Users,
  },
  {
    title: "Statistik Upload",
    description: "Lihat ringkasan aktivitas upload dan tren penggunaan.",
    icon: ShieldCheck,
  },
  {
    title: "Monitoring Model AI",
    description: "Awasi status model, performa, dan hasil inferensi.",
    icon: Bot,
  },
] as const;

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const displayName = session.user?.name ?? "Memories End XYZ";
  const navbarUser = {
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    role: session.user?.role ?? "ADMIN",
  };

  return (
    <AppShell variant="admin">
      <main className="min-h-screen bg-[#f4faf6] text-slate-900">
        <AppNavbar user={navbarUser} />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Admin Panel</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Halo, {displayName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Ruang kontrol sederhana untuk memantau data, pengguna, dan sistem AI Pilah Yuk!!
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {adminCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </AppShell>
  );
}