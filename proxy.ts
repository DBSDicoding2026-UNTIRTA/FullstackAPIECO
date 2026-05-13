import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register"] as const;

/** Routes that require a specific role to access. */
const ROLE_PROTECTED = {
  admin: "/admin",
  user: "/dashboard",
} as const;

/** Routes that require authentication but accept any role. */
const AUTH_ONLY_PREFIXES = ["/settings", "/quiz", "/ai-analyst"] as const;

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isProtectedPath(pathname: string): boolean {
  if (matchesPrefix(pathname, ROLE_PROTECTED.admin)) return true;
  if (matchesPrefix(pathname, ROLE_PROTECTED.user)) return true;
  return AUTH_ONLY_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.includes(pathname as (typeof AUTH_PAGES)[number]);
}

function getDestination(role: string | undefined): string {
  return role === "ADMIN" ? "/admin" : "/dashboard";
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role;

  // Redirect authenticated users away from auth pages
  if (isAuthPage(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(getDestination(role), request.url));
    }

    return NextResponse.next();
  }

  // Allow non-protected paths through
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // All protected paths require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-specific guards
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/quiz/:path*",
    "/ai-analyst/:path*",
    "/login",
    "/register",
  ],
};