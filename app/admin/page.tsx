import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, Bot, Database, FileQuestion, Users } from "lucide-react";

import { authOptions } from "@/lib/auth";
import AppShell from "@/components/shared/AppShell";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { translate } from "@/lib/i18n/dictionaries";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const settings = await getGlobalSettingsForSession(session);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(settings.preferences.language, key, values);

  const adminCards = [
    {
      title: t("admin.cards.quiz.title"),
      description: t("admin.cards.quiz.description"),
      icon: FileQuestion,
      href: "/admin/manage-quiz",
    },
    {
      title: t("admin.cards.users.title"),
      description: t("admin.cards.users.description"),
      icon: Users,
      href: "/admin/manage-user",
    },
    {
      title: t("admin.cards.stats.title"),
      description: t("admin.cards.stats.description"),
      icon: BarChart3,
      href: "/admin/statistik-upload",
    },
    {
      title: t("admin.cards.monitoring.title"),
      description: t("admin.cards.monitoring.description"),
      icon: Bot,
      href: "/admin/monitoring-model",
    },
    {
      title: t("admin.cards.dataset.title" as never) || "Dataset",
      description: t("admin.cards.dataset.description" as never) || "Seluruh data hasil klasifikasi AI yang tersimpan.",
      icon: Database,
      href: "/admin/dataset",
    },
  ] as const;

  const displayName = session.user?.name ?? "Admin";

  return (
    <AppShell variant="admin">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] sm:p-8 dark:border-emerald-900/60 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {t("admin.title")}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl dark:text-white">
            {t("dashboard.greeting", { name: displayName })}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
            {t("admin.subtitle")}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link key={card.title} href={card.href}>
                <article className="h-full cursor-pointer rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] transition-transform duration-200 hover:-translate-y-1 dark:border-emerald-900/60 dark:bg-slate-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {card.description}
                  </p>
                </article>
              </Link>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}