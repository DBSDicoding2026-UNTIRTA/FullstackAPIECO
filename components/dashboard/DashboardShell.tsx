import type { ReactNode } from "react";

interface DashboardShellProps {
  readonly children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-emerald-50 via-white to-transparent dark:from-emerald-950/20 dark:via-slate-950 dark:to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10">{children}</div>
    </main>
  );
}
