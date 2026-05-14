import React from "react";

type UserRef = {
  name?: string | null;
  email?: string | null;
};

type Message = {
  id: string;
  role: string;
  content: string;
  createdAt: string | Date;
  user?: UserRef | null;
};

type Props = {
  messages: Message[];
  locale: string;
  heading: string;
  emptyText: string;
};

export default function AiPilahMessages({ messages, locale, heading, emptyText }: Props) {
  return (
    <section className="rounded-[1.8rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/50 dark:bg-slate-900 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{heading}</h2>

      {messages.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-slate-600 dark:border-emerald-900/50 dark:bg-slate-950 dark:text-slate-300">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 dark:border-emerald-900/50 dark:bg-slate-950"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{message.role === "assistant" ? "AI" : "USER"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.createdAt))}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{message.content}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{message.user?.name ?? message.user?.email ?? "-"}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
