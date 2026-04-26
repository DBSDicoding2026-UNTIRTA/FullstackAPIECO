"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import AppLogo from "@/components/shared/AppLogo";
import GoogleLoginButton from "@/components/login/GoogleLoginButton";

export default function LoginCard() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setErrorMessage("Email atau password salah.");
        return;
      }

      router.replace(result?.url ?? "/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-emerald-300/30 bg-white/95 p-6 shadow-2xl shadow-emerald-900/15 backdrop-blur-sm sm:p-8">
      <header className="text-center">
        <div className="mx-auto inline-flex">
          <AppLogo href="/" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Masuk ke Pilah Yuk!!</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Lanjutkan perjalanan memilah sampah dan kumpulkan poin ramah lingkungan.
        </p>
      </header>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70"
            placeholder="nama@email.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="password" className="text-sm font-medium text-slate-800">
              Kata sandi
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-700 transition hover:text-emerald-600 hover:underline"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70"
            placeholder="Masukkan kata sandi"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-500 via-emerald-500 to-lime-500 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:brightness-105 active:scale-[0.99]"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}

      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">atau</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleLoginButton />

      <footer className="mt-6 text-center text-sm text-slate-600">
        <p>
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-emerald-700 transition hover:text-emerald-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </footer>
    </section>
  );
}
