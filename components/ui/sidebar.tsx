"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type LucideIcon,
  HelpCircle,
  Home,
  UploadCloud,
  Trophy,
  Award,
  BarChart2,
  Settings,
  ShieldCheck,
  Users,
  Database,
  Cpu,
  Recycle,
} from "lucide-react";
import { NavIcon } from "./NavIcon";

type Variant = "user" | "admin";

interface RouteItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const userRoutes: RouteItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Upload", href: "/dashboard/upload", icon: UploadCloud },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { label: "Badge", href: "/dashboard/badges", icon: Award },
  { label: "Statistik", href: "/dashboard/statistics", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminRoutes: RouteItem[] = [
  { label: "Admin", href: "/admin", icon: ShieldCheck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Dataset", href: "/admin/dataset", icon: Database },
  { label: "Model", href: "/admin/model", icon: Cpu },
  { label: "Settings", href: "/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard")
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (href === "/admin")
    return pathname === "/admin" || pathname.startsWith("/admin/");
  return pathname === href || pathname.startsWith(href + "/");
}

export interface SidebarProps {
  variant?: Variant;
  userName?: string; // 👈 hanya nama user
}

export function Sidebar({ variant = "user", userName = "User" }: SidebarProps) {
  const pathname = usePathname() || "/";
  const routes = variant === "admin" ? adminRoutes : userRoutes;

  return (
    <>
      {/* Sidebar Tengah (VERTICAL CENTER) */}
      <aside
        className="
        fixed left-6 top-1/2 -translate-y-1/2
        z-40 hidden md:flex
        w-20 flex-col items-center gap-4
        rounded-2xl border border-emerald-100/80
        bg-white/90 px-2 py-4
        shadow-[0_15px_40px_rgba(16,185,129,0.15)]
        backdrop-blur-xl
      "
      >
        {/* Logo */}
        <Link href={variant === "admin" ? "/admin" : "/dashboard"}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
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

        {/* Profile (Nama saja) */}
        <div className="mt-2 flex flex-col items-center gap-1 text-center">
          <div className="h-px w-8 bg-emerald-100" />
          <p className="text-[10px] font-medium text-emerald-700 truncate max-w-[70px]">
            {userName}
          </p>
        </div>

        {/* Help */}
        <NavIcon icon={HelpCircle} label="Help" variant="sidebar" active={false} />
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-3 md:hidden">
        <nav className="flex justify-between rounded-3xl border border-emerald-100 bg-white/90 px-2 py-2 shadow-md">
          {routes.map((r) => (
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