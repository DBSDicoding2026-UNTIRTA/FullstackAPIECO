import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

import type { Session } from "next-auth";

type AdminAuthResult =
  | { session: Session; error: null }
  | { session: null; error: NextResponse };

/**
 * Require an authenticated ADMIN session for API route handlers.
 *
 * Returns the session on success, or a pre-built `NextResponse` error
 * that the caller can return immediately.
 *
 * @example
 * ```ts
 * export async function GET() {
 *   const auth = await requireAdminApi();
 *   if (auth.error) return auth.error;
 *   // auth.session is guaranteed to be an ADMIN session
 * }
 * ```
 */
export async function requireAdminApi(): Promise<AdminAuthResult> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (session.user?.role !== "ADMIN") {
    return {
      session: null,
      error: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return { session, error: null };
}
