import "server-only";

import type { Session } from "next-auth";

import prisma from "@/lib/prisma";
import {
  defaultPreferences,
  guestSettings,
  normalizeLanguage,
  normalizeTheme,
} from "@/lib/settings/defaults";
import type { GlobalSettings } from "@/types/settings";

export async function getGlobalSettingsForSession(
  session: Session | null,
): Promise<GlobalSettings> {
  if (!session?.user?.id) {
    return guestSettings;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      bio: true,
      avatar: true,
      image: true,
      theme: true,
      language: true,
    },
  });

  if (!user) {
    return guestSettings;
  }

  return {
    userId: user.id,
    role: user.role,
    profile: {
      name: user.name ?? "",
      username: user.username ?? "",
      email: user.email,
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      avatar: user.avatar ?? user.image ?? "",
    },
    preferences: {
      ...defaultPreferences,
      theme: normalizeTheme(user.theme),
      language: normalizeLanguage(user.language),
    },
  };
}

