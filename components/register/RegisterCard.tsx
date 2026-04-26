"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import gsap from "gsap";

import AppLogo from "@/components/shared/AppLogo";

export default function RegisterCard() {
  const cardRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline
        .from("[data-register-card]", {
          y: 32,
          opacity: 0,
          duration: 0.8,
        })
        .from(
          "[data-register-input]",
          {
            y: 16,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.45",
        )
        .from(
          "[data-register-action]",
          {
            y: 10,
            opacity: 0,
            duration: 0.45,
          },
          "-=0.2",
        );
    }, cardRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const ageRaw = String(formData.get("age") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const age = ageRaw === "" ? null : Number(ageRaw);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          age,
          password,
        }),
      });

      const result: { message?: string } = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message ?? "Register gagal.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (signInResult?.error) {
        router.replace("/login");
        return;
      }

      router.replace(signInResult?.url ?? "/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={cardRef}
      data-register-card
      className="w-full max-w-md rounded-2xl border border-emerald-200/30 bg-white/95 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-md sm:p-8"
    >
      <header className="text-center">
        <div className="mx-auto inline-flex">
          <AppLogo href="/" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Buat Akun Pilah Yuk!!</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Mulai pilah sampah, kumpulkan poin, dan bantu bumi jadi lebih bersih.
        </p>
      </header>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2" data-register-input>
          <label htmlFor="name" className="text-sm font-medium text-slate-800">
            Nama
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Nama lengkap"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70"
          />
        </div>

        <div className="space-y-2" data-register-input>
          <label htmlFor="email" className="text-sm font-medium text-slate-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nama@email.com"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70"
          />
        </div>

        <div className="space-y-2" data-register-input>
          <label htmlFor="age" className="text-sm font-medium text-slate-800">
            Umur <span className="text-slate-500">(opsional)</span>
          </label>
          <input
            id="age"
            name="age"
            type="number"
            inputMode="numeric"
            min={8}
            max={120}
            placeholder="Contoh: 21"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70"
          />
        </div>

        <div className="space-y-2" data-register-input>
          <label htmlFor="password" className="text-sm font-medium text-slate-800">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Buat password aman"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70"
          />
        </div>

        <div data-register-action>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-500 via-emerald-500 to-lime-500 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 transition hover:brightness-105 active:scale-[0.99]"
          >
            {isSubmitting ? "Memproses..." : "Daftar"}
          </button>
        </div>
      </form>

      {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}

      <footer className="mt-6 text-center text-sm text-slate-600" data-register-action>
        <p>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-emerald-700 transition hover:text-emerald-600 hover:underline">
            Masuk
          </Link>
        </p>
      </footer>
    </section>
  );
}
