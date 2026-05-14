import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

interface RequireUserOptions {
  readonly adminRedirectTo?: string;
}

export async function requireUser(options?: RequireUserOptions) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role === "ADMIN") {
    redirect(options?.adminRedirectTo ?? "/admin");
  }

  if (session.user?.role !== "USER") {
    redirect("/login");
  }

  return session;
}