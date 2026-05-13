import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import SettingsPageClient from "@/components/settings/SettingsPageClient";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Pengaturan | PilahYuk",
  description: "Pengaturan akun pengguna PilahYuk",
};

function formatProvider(provider: string) {
  if (provider === "credentials") return "Credentials";
  if (provider === "google") return "Google";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      password: true,
      createdAt: true,
      lastLoginAt: true,
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const providerSet = new Set<string>();

  if (user.password) {
    providerSet.add("credentials");
  }

  user.accounts.forEach((account) => {
    providerSet.add(account.provider);
  });

  return (
    <SettingsPageClient
      security={{
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        loginProviders: Array.from(providerSet).map(formatProvider),
        activeSession: {
          strategy: "JWT",
          expires: session.expires ?? null,
          status: "Aktif sekarang",
        },
        canChangePassword: Boolean(user.password),
      }}
    />
  );
}
