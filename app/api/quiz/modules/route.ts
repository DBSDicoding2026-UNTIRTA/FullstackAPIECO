import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user?.role !== "USER") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const modules = await prisma.quizModule.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        order: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      xpReward: true,
      _count: {
        select: {
          quizzes: true,
        },
      },
    },
  });

  return NextResponse.json(
    modules.map((moduleRecord) => ({
      id: moduleRecord.id,
      title: moduleRecord.title,
      description: moduleRecord.description,
      order: moduleRecord.order,
      xpReward: moduleRecord.xpReward,
      questionCount: moduleRecord._count.quizzes,
    }))
  );
}
