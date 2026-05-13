import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly icon: LucideIcon;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly tone?: "default" | "danger";
}

export default function SettingsSection({
  id,
  title,
  description,
  icon: Icon,
  children,
  footer,
  tone = "default",
}: SettingsSectionProps) {
  const isDanger = tone === "danger";

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-[1.5rem] border bg-white shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] transition-colors duration-300 dark:bg-slate-900",
        isDanger
          ? "border-rose-200 dark:border-rose-900/60"
          : "border-emerald-100 dark:border-emerald-900/60",
      )}
    >
      <header
        className={cn(
          "flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6",
          isDanger
            ? "border-rose-100 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/20"
            : "border-emerald-100 bg-white dark:border-emerald-900/60 dark:bg-slate-900",
        )}
      >
        <div className="flex gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
              isDanger
                ? "bg-rose-100 text-rose-700"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="p-5 sm:p-6">{children}</div>

      {footer ? (
        <footer className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/70 sm:px-6">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
