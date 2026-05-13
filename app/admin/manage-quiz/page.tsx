import AppShell from "@/components/shared/AppShell";
import ModuleManager from "@/components/admin/quiz/ModuleManager";
import QuizForm from "@/components/admin/quiz/QuizForm";
import QuizList from "@/components/admin/quiz/QuizList";
import { requireAdmin } from "@/lib/admin-auth";
import { School, Sparkles } from "lucide-react";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { translate } from "@/lib/i18n/dictionaries";

export default async function ManageQuizPage() {
  const session = await requireAdmin();
  const settings = await getGlobalSettingsForSession(session);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(settings.preferences.language, key, values);

  return (
    <AppShell variant="admin">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Admin Quiz
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl dark:text-white">
                {t("admin.cards.quiz.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
                {t("admin.cards.quiz.description")}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <div className="flex items-center gap-2 font-semibold">
                <School className="h-4 w-4" />
                {t("admin.cards.quiz.adminOnly") || "Hanya ADMIN"}
              </div>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                {t("admin.cards.quiz.adminOnlyDesc") || "Halaman ini terkunci untuk role admin saja."}
              </p>
            </div>
          </div>
        </section>

        <ModuleManager />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,740px)_minmax(0,1fr)]">
          <QuizForm />
          <QuizList />
        </div>
      </div>
    </AppShell>
  );
}
