"use client";

import React from "react";
import { Sidebar } from "@/components/ui/sidebar";

interface AppShellProps {
  children: React.ReactNode;
  variant?: "user" | "admin";
  userName?: string;
}

export default function AppShell({
  children,
  variant = "user",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f4faf6]">
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
