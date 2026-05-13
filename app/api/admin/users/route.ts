import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin-api-auth";
import prisma from "@/lib/prisma";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  avatar: true,
  role: true,
  points: true,
  level: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));
  const skip = (page - 1) * limit;

  const where = search.length > 0
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
