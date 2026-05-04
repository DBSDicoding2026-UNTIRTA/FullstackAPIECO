import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get("moduleId");

  if (!moduleId) {
    return NextResponse.json(
      { message: "moduleId wajib diisi." },
      { status: 400 }
    );
  }

  const moduleRecord = await prisma.quizModule.findFirst({
    where: {
      id: moduleId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!moduleRecord) {
    return NextResponse.json(
      { message: "Modul tidak ditemukan." },
      { status: 404 }
    );
  }

  const quizzes = await prisma.quizQuestion.findMany({
    where: {
      moduleId: moduleRecord.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      question: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      points: true,
    },
  });

  return NextResponse.json(quizzes);
}