"use client";

import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import AdminMobileNav from "@/components/admin/layout/AdminMobileNav";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopbar from "@/components/admin/layout/AdminTopbar";

interface AppShellProps {
  children: React.ReactNode;
  variant?: "user" | "admin";
  userName?: string;
}

export default function AppShell({
  children,
  variant = "user",
}: AppShellProps) {
  if (variant === "admin") {
    return (
      <div className="min-h-screen bg-[#f4faf6] transition-colors duration-300 dark:bg-slate-950">
        <AdminSidebar />

        {/* Content area — shifts right on md+ based on sidebar width.
            The sidebar is 256px expanded / 72px collapsed.
            We use a CSS variable approach with a safe default for SSR. */}
        <div className="flex min-h-screen flex-col transition-all duration-300 md:pl-[72px] lg:pl-[256px]">
          <AdminTopbar />

          <main className="relative z-10 flex-1 pb-28 md:pb-0" aria-live="polite">
            {children}
          </main>
        </div>
        <AdminMobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4faf6] transition-colors duration-300 dark:bg-slate-950">
      <Sidebar variant={variant} />

      <main
        className="relative z-10 min-h-screen w-full md:pl-34 lg:pl-34"
        aria-live="polite"
      >
        {children}
      </main>
    </div>
  );
}
