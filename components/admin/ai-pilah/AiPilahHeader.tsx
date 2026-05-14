import React from "react";

type Props = {
  title: string;
  subtitle?: string;
};

export default function AiPilahHeader({ title, subtitle }: Props) {
  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] dark:border-emerald-900/50 dark:bg-slate-900">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
      {subtitle ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{subtitle}</p>
      ) : null}
    </section>
  );
}
