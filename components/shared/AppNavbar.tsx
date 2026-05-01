"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

import type { Role } from "@/lib/generated/prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppNavbarUser {
  readonly name: string | null;
  readonly image: string | null;
  readonly role: Role;
}

interface AppNavbarProps {
  readonly user: AppNavbarUser;
}

function getInitials(name: string | null): string {
  if (!name) return "PU";

  const [first, second] = name.trim().split(/\s+/);
  const initials = `${first?.[0] ?? "P"}${second?.[0] ?? "U"}`;
  return initials.toUpperCase();
}

export default function AppNavbar({ user }: AppNavbarProps) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const homeHref = user.role === "ADMIN" ? "/admin" : "/dashboard";

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Navigasi aplikasi">
        <Link href={homeHref} className="inline-flex items-center gap-2 rounded-md px-1 py-1 text-slate-900">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-lg font-bold tracking-tight text-emerald-700 sm:text-xl">PilahYuk</span>
        </Link>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Buka menu profil"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-2 py-1.5 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Avatar className="h-8 w-8 border border-emerald-100">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback className="bg-emerald-50 text-xs font-semibold text-emerald-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-36 truncate text-sm font-medium text-slate-700 sm:block">{user.name ?? "Pengguna"}</span>
              <ChevronDown
                className={`h-4 w-4 text-emerald-700 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-52 rounded-xl border border-emerald-100 bg-white p-2 shadow-[0_18px_42px_-28px_rgba(16,185,129,0.45)]"
          >
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-700">
              <Link href="#" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Settings className="h-4 w-4" aria-hidden="true" />
                Pengaturan
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-emerald-100" />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logout..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}