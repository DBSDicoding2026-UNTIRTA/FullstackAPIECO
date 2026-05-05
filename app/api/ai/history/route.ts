import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "USER") {
      return NextResponse.json(
        { error: "Only users can access this endpoint" },
        { status: 403 }
      );
    }

    // Get limit from query params
    const limit = Math.min(
      Number(request.nextUrl.searchParams.get("limit")) || 10,
      100
    );

    // Fetch history ordered by newest first
    const history = await prisma.aIAnalysisHistory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        imageUrl: true,
        result: true,
        confidence: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: history });
  } catch (error) {
    console.error("[AI_HISTORY_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
