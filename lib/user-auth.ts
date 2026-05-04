import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role === "ADMIN") {
    redirect("/admin");
  }

  if (session.user?.role !== "USER") {
    redirect("/login");
  }

  return session;
}