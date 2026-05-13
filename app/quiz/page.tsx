import AppNavbar from "../../components/shared/AppNavbar";
import AppShell from "../../components/shared/AppShell";
import UserQuizClient from "../../components/quiz/UserQuizClient";
import { requireUser } from "../../lib/user-auth";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { translate } from "@/lib/i18n/dictionaries";

export default async function QuizPage() {
  const session = await requireUser();
  const settings = await getGlobalSettingsForSession(session);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(settings.preferences.language, key, values);

  const navbarUser = {
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    role: session.user?.role ?? "USER",
  };

  return (
    <AppShell variant="user">
      <main className="min-h-screen bg-[#f4faf6] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AppNavbar user={navbarUser} />

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              {t("quiz.header.badge")}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl dark:text-white">
              {t("quiz.header.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
              {t("quiz.header.subtitle")}
            </p>
          </section>

          <UserQuizClient />
        </div>
      </main>
    </AppShell>
  );
}