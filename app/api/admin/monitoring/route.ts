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
    /* ── Total inferences ── */
    const totalInferences = await prisma.aIAnalysisHistory.count();

    /* ── Average confidence ── */
    const aggConf = await prisma.aIAnalysisHistory.aggregate({
      _avg: { confidence: true },
      _min: { confidence: true },
      _max: { confidence: true },
    });

    /* ── Confidence buckets ── */
    const allHistories = await prisma.aIAnalysisHistory.findMany({
      select: { confidence: true },
    });

    let highConf = 0;
    let midConf = 0;
    let lowConf = 0;
    for (const h of allHistories) {
      if (h.confidence >= 0.8) highConf++;
      else if (h.confidence >= 0.5) midConf++;
      else lowConf++;
    }

    /* ── Inferences today ── */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const inferencesToday = await prisma.aIAnalysisHistory.count({
      where: { createdAt: { gte: todayStart } },
    });

    /* ── Class distribution ── */
    const classDistribution = await prisma.aIAnalysisHistory.groupBy({
      by: ["result"],
      _count: { id: true },
      _avg: { confidence: true },
      orderBy: { _count: { id: "desc" } },
    });

    /* ── Hourly breakdown (last 24h) ── */
    const dayAgo = new Date();
    dayAgo.setHours(dayAgo.getHours() - 24);
    const last24h = await prisma.aIAnalysisHistory.findMany({
      where: { createdAt: { gte: dayAgo } },
      select: { createdAt: true, confidence: true },
      orderBy: { createdAt: "asc" },
    });

    const hourlyMap: Record<string, { count: number; sumConf: number }> = {};
    for (const h of last24h) {
      const hourKey = `${h.createdAt.getHours().toString().padStart(2, "0")}:00`;
      const entry = hourlyMap[hourKey] ?? { count: 0, sumConf: 0 };
      entry.count += 1;
      entry.sumConf += h.confidence;
      hourlyMap[hourKey] = entry;
    }

    const hourlyBreakdown = Array.from({ length: 24 }, (_, i) => {
      const key = `${i.toString().padStart(2, "0")}:00`;
      const entry = hourlyMap[key];
      return {
        hour: key,
        count: entry?.count ?? 0,
        avgConfidence: entry ? entry.sumConf / entry.count : 0,
      };
    });

    /* ── Recent inferences ── */
    const recentInferences = await prisma.aIAnalysisHistory.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      totalInferences,
      inferencesToday,
      avgConfidence: aggConf._avg.confidence ?? 0,
      minConfidence: aggConf._min.confidence ?? 0,
      maxConfidence: aggConf._max.confidence ?? 0,
      confidenceBuckets: { high: highConf, mid: midConf, low: lowConf },
      classDistribution: classDistribution.map((c) => ({
        label: c.result,
        count: c._count.id,
        avgConfidence: c._avg.confidence ?? 0,
      })),
      hourlyBreakdown,
      recentInferences: recentInferences.map((r) => ({
        id: r.id,
        result: r.result,
        confidence: r.confidence,
        createdAt: r.createdAt.toISOString(),
        userName: r.user.name ?? r.user.email,
      })),
    });
  } catch (error) {
    console.error("[ADMIN_MONITORING]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
