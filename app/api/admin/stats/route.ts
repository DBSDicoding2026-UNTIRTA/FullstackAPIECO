import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    /* ── Total uploads ── */
    const totalUploads = await prisma.aIAnalysisHistory.count();

    /* ── Uploads today ── */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const uploadsToday = await prisma.aIAnalysisHistory.count({
      where: { createdAt: { gte: todayStart } },
    });

    /* ── Uploads this week (last 7 days) ── */
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const uploadsThisWeek = await prisma.aIAnalysisHistory.count({
      where: { createdAt: { gte: weekAgo } },
    });

    /* ── Average confidence ── */
    const avgConfidence = await prisma.aIAnalysisHistory.aggregate({
      _avg: { confidence: true },
    });

    /* ── Unique uploaders ── */
    const uniqueUsers = await prisma.aIAnalysisHistory.groupBy({
      by: ["userId"],
    });

    /* ── Distribution by waste type ── */
    const wasteDistribution = await prisma.aIAnalysisHistory.groupBy({
      by: ["result"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    /* ── Daily uploads (last 14 days) ── */
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const recentUploads = await prisma.aIAnalysisHistory.findMany({
      where: { createdAt: { gte: twoWeeksAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by date string
    const dailyMap: Record<string, number> = {};
    for (const u of recentUploads) {
      const dateKey = u.createdAt.toISOString().slice(0, 10);
      dailyMap[dateKey] = (dailyMap[dateKey] ?? 0) + 1;
    }

    // Fill in empty dates
    const dailyUploads: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyUploads.push({ date: key, count: dailyMap[key] ?? 0 });
    }

    /* ── Recent uploads list ── */
    const recentList = await prisma.aIAnalysisHistory.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({
      totalUploads,
      uploadsToday,
      uploadsThisWeek,
      avgConfidence: avgConfidence._avg.confidence ?? 0,
      uniqueUsers: uniqueUsers.length,
      wasteDistribution: wasteDistribution.map((w) => ({
        type: w.result,
        count: w._count.id,
      })),
      dailyUploads,
      recentList: recentList.map((r) => ({
        id: r.id,
        result: r.result,
        confidence: r.confidence,
        createdAt: r.createdAt.toISOString(),
        user: {
          name: r.user.name,
          email: r.user.email,
          image: r.user.image,
        },
      })),
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
