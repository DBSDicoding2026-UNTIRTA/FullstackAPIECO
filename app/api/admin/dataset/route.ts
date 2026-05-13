import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = 15;
  const filterType = searchParams.get("type") ?? "";
  const search = searchParams.get("search") ?? "";

  try {
    const where: Record<string, unknown> = {};

    if (filterType) {
      where.result = filterType;
    }

    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [total, items] = await Promise.all([
      prisma.aIAnalysisHistory.count({ where }),
      prisma.aIAnalysisHistory.findMany({
        where,
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, image: true } },
        },
      }),
    ]);

    /* Unique waste types for filter dropdown */
    const wasteTypes = await prisma.aIAnalysisHistory.groupBy({
      by: ["result"],
      orderBy: { _count: { id: "desc" } },
    });

    /* Summary stats */
    const totalRecords = await prisma.aIAnalysisHistory.count();
    const avgConf = await prisma.aIAnalysisHistory.aggregate({
      _avg: { confidence: true },
    });

    return NextResponse.json({
      items: items.map((i) => ({
        id: i.id,
        imageUrl: i.imageUrl,
        result: i.result,
        confidence: i.confidence,
        createdAt: i.createdAt.toISOString(),
        user: {
          name: i.user.name,
          email: i.user.email,
          image: i.user.image,
        },
      })),
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      wasteTypes: wasteTypes.map((w) => w.result),
      summary: {
        totalRecords,
        avgConfidence: avgConf._avg.confidence ?? 0,
      },
    });
  } catch (error) {
    console.error("[ADMIN_DATASET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
