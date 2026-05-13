"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, LogOut, User, UserCircle, Info, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";

export function UserButton() {
  const { data: session, status } = useSession();
  const { profile, t } = useSettings();
  const router = useRouter();

  const handleAboutClick = () => {
    router.push("/about");
  };

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-emerald-100 bg-white/90 text-slate-500 shadow-[0_8px_24px_rgba(16,185,129,0.08)] hover:bg-emerald-50 hover:text-emerald-700">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
      </Button>
    );
  }

  if (!session) {
    return (
      <Button
        onClick={() => signIn()}
        variant="outline"
        className="rounded-full border-emerald-200 bg-white px-4 text-slate-700 shadow-[0_8px_24px_rgba(16,185,129,0.08)] transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <UserCircle className="mr-2 h-4 w-4 text-emerald-600" />
        Sign In
      </Button>
    );
  }

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "relative h-11 rounded-full border-emerald-100 bg-white pl-1 pr-4 text-slate-700 shadow-[0_8px_24px_rgba(16,185,129,0.08)] transition-all",
            "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-0"
          )}
        >
          <span className="relative">
            <Avatar className="h-9 w-9 border border-emerald-100 bg-emerald-50">
              <AvatarImage
                src={profile.avatar || session.user?.image || ""}
                alt={profile.name || session.user?.name || ""}
              />
              <AvatarFallback className="bg-emerald-100 font-medium text-emerald-700">
                {(profile.name || session.user?.name || "P")?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </span>
          <span className="max-w-[9rem] truncate text-sm font-medium text-slate-700">
            {(profile.name || session.user?.name)?.split(" ")[0]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 border-emerald-100 bg-white/95 p-2 shadow-[0_20px_60px_rgba(16,185,129,0.14)] backdrop-blur-xl"
        align="end"
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold leading-none text-slate-800">
              {profile.name || session.user?.name}
            </p>
            <p className="truncate text-xs leading-none text-slate-500">
              {profile.email || session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="flex cursor-pointer items-center rounded-md p-3 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          <User className="mr-2 h-4 w-4 text-emerald-600" />
          {t("settings.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleAboutClick}
          className="flex cursor-pointer items-center rounded-md p-3 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Info className="mr-2 h-4 w-4 text-emerald-600" />
          About
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex cursor-pointer items-center rounded-md p-3 text-sm text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="mr-2 h-4 w-4 text-rose-500" />
          {t("common.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
