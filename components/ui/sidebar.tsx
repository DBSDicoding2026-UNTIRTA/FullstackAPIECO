"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type LucideIcon,
  HelpCircle,
  Home,
  Brain,
  BarChart2,
  Settings,
  Cpu,
  Recycle,
  Bot,
} from "lucide-react";
import { NavIcon } from "./NavIcon";
import { useSettings } from "@/hooks/use-settings";

type Variant = "user" | "admin";

interface RouteItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export interface SidebarProps {
  variant?: Variant;
  userName?: string;
}

export function Sidebar({ userName = "User" }: SidebarProps) {
  const pathname = usePathname() || "/";
  const { profile, t } = useSettings();

  const routes: RouteItem[] = [
    { label: t("nav.dashboard"), href: "/dashboard", icon: Home },
    { label: t("nav.quiz"), href: "/quiz", icon: Brain },
    { label: t("nav.aiAnalyst"), href: "/ai-analyst", icon: Cpu },
    { label: "AI Pilah", href: "/ai-pilah", icon: Bot },
    { label: t("nav.statistics"), href: "/dashboard/statistics", icon: BarChart2 },
    { label: t("nav.settings"), href: "/settings", icon: Settings },
  ];
  const mobileRoutes = [
    routes[0],
    routes[1],
    routes[2],
    routes[3],
    routes[5],
  ].filter(Boolean);

  const displayName = profile.username || profile.name || userName;

  return (
    <>
      {/* Sidebar Tengah */}
      <aside
        className="
        fixed left-6 top-1/2 -translate-y-1/2
        z-40 hidden md:flex
        w-20 flex-col items-center gap-4
        rounded-2xl border border-emerald-100/80
        bg-white/90 px-2 py-4
        shadow-[0_15px_40px_rgba(16,185,129,0.15)]
        backdrop-blur-xl
        transition-colors duration-300
        dark:border-emerald-900/60 dark:bg-slate-950/90
      "
      >
        {/* Logo */}
        <Link href="/dashboard">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
            <Recycle className="h-5 w-5 text-emerald-600" />
          </div>
        </Link>

        {/* Menu */}
        <nav className="flex flex-col items-center gap-2">
          {routes.map((r) => (
            <Link key={r.href} href={r.href}>
              <NavIcon
                icon={r.icon}
                label={r.label}
                variant="sidebar"
                active={isActive(pathname, r.href)}
              />
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <div className="mt-2 flex flex-col items-center gap-1 text-center">
          <div className="h-px w-8 bg-emerald-100 dark:bg-emerald-900" />
          <p className="text-[10px] font-medium text-emerald-700 truncate max-w-17.5">
            {displayName}
          </p>
        </div>

        {/* Help */}
        <NavIcon icon={HelpCircle} label={t("nav.help")} variant="sidebar" active={false} />
      </aside>

      {/* Mobile */}
      <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-3 md:hidden">
        <nav className="flex justify-between rounded-3xl border border-emerald-100 bg-white/90 px-2 py-2 shadow-md transition-colors duration-300 dark:border-emerald-900/60 dark:bg-slate-950/90">
          {mobileRoutes.map((r) => (
            <Link key={r.href} href={r.href}>
              <NavIcon
                icon={r.icon}
                label={r.label}
                variant="bottom"
                active={isActive(pathname, r.href)}
              />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
