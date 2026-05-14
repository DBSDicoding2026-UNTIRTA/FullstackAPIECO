import React from "react";
import { MessageSquareText, Users, Clock3 } from "lucide-react";

type Labels = {
  totalChats: string;
  activeUsers: string;
  latestMessages: string;
};

type Props = {
  totalChats: number;
  activeUsers: number;
  latestMessagesCount: number;
  locale: string;
  labels: Labels;
};

export default function AiPilahStats({ totalChats, activeUsers, latestMessagesCount, locale, labels }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/50 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{labels.totalChats}</p>
          <MessageSquareText className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
        </div>
        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{new Intl.NumberFormat(locale).format(totalChats)}</p>
      </article>

      <article className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/50 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{labels.activeUsers}</p>
          <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
        </div>
        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{new Intl.NumberFormat(locale).format(activeUsers)}</p>
      </article>

      <article className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/50 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{labels.latestMessages}</p>
          <Clock3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
        </div>
        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{new Intl.NumberFormat(locale).format(latestMessagesCount)}</p>
      </article>
    </section>
  );
}
