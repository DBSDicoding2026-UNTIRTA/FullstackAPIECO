import AppNavbar from "../../components/shared/AppNavbar";
import AppShell from "../../components/shared/AppShell";
import UserQuizClient from "../../components/quiz/UserQuizClient";
import { requireUser } from "../../lib/user-auth";

export default async function QuizPage() {
  const session = await requireUser();

  const navbarUser = {
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    role: session.user?.role ?? "USER",
  };

  return (
    <AppShell variant="user">
      <main className="min-h-screen bg-[#f4faf6] text-slate-900">
        <AppNavbar user={navbarUser} />

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)]">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
              Quiz Edukasi
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Latihan memilah sampah
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Jawab pertanyaan seperti Duolingo. Jika benar, XP akan otomatis
              masuk ke akun kamu.
            </p>
          </section>

          <UserQuizClient />
        </div>
      </main>
    </AppShell>
  );
}