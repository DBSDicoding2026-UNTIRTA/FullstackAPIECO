import "server-only";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { SettingsActionError } from "@/lib/actions/settings-errors";

export async function requireSettingsSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new SettingsActionError("Unauthorized", 401);
  }

  return session;
}

