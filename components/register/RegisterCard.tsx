"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import gsap from "gsap";

import AppLogo from "@/components/shared/AppLogo";
import { useSettings } from "@/hooks/use-settings";

export default function RegisterCard() {
  const cardRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const { t } = useSettings();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      if (!cardRef.current) return;

      const registerCards = [cardRef.current];
      const registerInputs = gsap.utils.toArray<HTMLElement>(
        cardRef.current.querySelectorAll("[data-register-input]"),
      );
      const registerActions = gsap.utils.toArray<HTMLElement>(
        cardRef.current.querySelectorAll("[data-register-action]"),
      );
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (registerCards.length > 0) {
        timeline.from(registerCards, {
          y: 32,
          opacity: 0,
          duration: 0.8,
        });
      }

      if (registerInputs.length > 0) {
        timeline.from(
          registerInputs,
          {
            y: 16,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.45",
        );
      }

      if (registerActions.length > 0) {
        timeline.from(
          registerActions,
          {
            y: 10,
            opacity: 0,
            duration: 0.45,
          },
          "-=0.2",
        );
      }
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
        setErrorMessage(result.message ?? t("auth.error.registerFailed"));
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
      className="w-full max-w-md rounded-2xl border border-emerald-200/30 bg-white/95 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-md sm:p-8 dark:border-emerald-900/50 dark:bg-slate-900/90"
    >
      <header className="text-center">
        <div className="mx-auto inline-flex">
          <AppLogo href="/" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("auth.register.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {t("auth.register.subtitle")}
        </p>
      </header>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2" data-register-input>
          <label htmlFor="name" className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("auth.label.name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t("auth.placeholder.fullName")}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2" data-register-input>
          <label htmlFor="email" className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("auth.label.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t("auth.placeholder.email")}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2" data-register-input>
          <label htmlFor="age" className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("auth.label.age")} <span className="text-slate-500">{t("auth.optional")}</span>
          </label>
          <input
            id="age"
            name="age"
            type="number"
            inputMode="numeric"
            min={8}
            max={120}
            placeholder={t("auth.placeholder.age")}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2" data-register-input>
          <label htmlFor="password" className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("auth.label.password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder={t("auth.placeholder.password")}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div data-register-action>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-500 via-emerald-500 to-lime-500 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 transition hover:brightness-105 active:scale-[0.99]"
          >
            {isSubmitting ? t("common.processing") : t("common.register")}
          </button>
        </div>
      </form>

      {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}

      <footer className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300" data-register-action>
        <p>
          {t("auth.register.haveAccount")} {" "}
          <Link href="/login" className="font-semibold text-emerald-700 transition hover:text-emerald-600 hover:underline">
            {t("common.login")}
          </Link>
        </p>
      </footer>
    </section>
  );
}
