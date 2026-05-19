import { BarChart3, BookOpenText, History, MessageSquareText } from "lucide-react";

import type { AiPilahSidebarText } from "./types";

interface AiPilahSidebarProps {
  readonly text: AiPilahSidebarText;
}

export function AiPilahSidebar({ text }: AiPilahSidebarProps) {
  const menuItems = [
    {
      label: text.newChat,
      href: "#chat-ai",
      icon: MessageSquareText,
    },
    {
      label: text.title,
      href: "#riwayat-chat",
      icon: History,
    },
    {
      label: text.newChat,
      href: "#chat-ai",
      icon: BookOpenText,
    },
    {
      label: text.title,
      href: "#riwayat-chat",
      icon: BarChart3,
    },
  ] as const;

  return (
    <aside className="w-full lg:w-65 lg:self-start lg:sticky lg:top-24">
      <div className="rounded-[28px] border border-emerald-100 bg-white/80 p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] backdrop-blur-xl dark:border-emerald-900/40 dark:bg-slate-900/70 dark:text-slate-100 dark:backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
          {text.title}
        </p>

        <nav className="mt-4 space-y-2" aria-label={text.title}>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={`${item.href}-${item.icon.displayName ?? item.icon.name}`}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-emerald-800/70 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-slate-900/80 dark:text-emerald-300 dark:shadow-[0_0_24px_rgba(16,185,129,0.12)]">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
          <p className="text-sm leading-6 text-emerald-900/90 dark:text-emerald-200">
            {text.empty}
          </p>
        </div>
      </div>
    </aside>
  );
}