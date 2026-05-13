"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavIcon } from "@/components/ui/NavIcon";
import { useSettings } from "@/hooks/use-settings";
import { getAdminRoutes, isActive } from "./AdminSidebar";

export default function AdminMobileNav() {
  const pathname = usePathname() || "/";
  const { t } = useSettings();
  const routes = getAdminRoutes(t as (key: string) => string);
  const mobileRoutes = [...routes.main.slice(0, 4), ...routes.footer];

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4 md:hidden">
      <nav
        aria-label="Admin mobile navigation"
        className="flex items-center justify-between rounded-3xl border border-emerald-100 bg-white/90 px-2 py-2 shadow-[0_14px_34px_-18px_rgba(15,118,110,0.65)] backdrop-blur-xl dark:border-emerald-900/60 dark:bg-slate-950/90"
      >
        {mobileRoutes.map((route) => (
          <Link key={route.href} href={route.href} aria-label={route.label}>
            <NavIcon
              icon={route.icon}
              label={route.label}
              variant="bottom"
              active={isActive(pathname, route.href)}
              className="h-10 w-10 min-[380px]:h-11 min-[380px]:w-11"
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}
