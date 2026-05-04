import AppNavbar from "@/components/shared/AppNavbar";
import AppShell from "@/components/shared/AppShell";
import QuizForm from "@/components/admin/quiz/QuizForm";
import QuizList from "@/components/admin/quiz/QuizList";
import { requireAdmin } from "@/lib/admin-auth";
import { School, Sparkles } from "lucide-react";

export default async function ManageQuizPage() {
  const session = await requireAdmin();

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
          <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)]">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  Admin Quiz
                </p>
                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Kelola Quiz
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Buat pertanyaan belajar yang ringan, playful, dan siap dipakai
                  untuk mengumpulkan XP user.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                <div className="flex items-center gap-2 font-semibold">
                  <School className="h-4 w-4" />
                  Hanya ADMIN
                </div>
                <p className="mt-1 text-xs text-emerald-700">
                  Halaman ini terkunci untuk role admin saja.
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,740px)_minmax(0,1fr)]">
            <QuizForm />
            <QuizList />
          </div>
        </div>
      </main>
    </AppShell>
  );
}