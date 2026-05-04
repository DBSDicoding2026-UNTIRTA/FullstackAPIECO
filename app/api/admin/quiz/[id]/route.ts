import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdmin();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "ID quiz tidak valid." },
      { status: 400 }
    );
  }

  const existingQuiz = await prisma.quizQuestion.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingQuiz) {
    return NextResponse.json(
      { message: "Quiz tidak ditemukan." },
      { status: 404 }
    );
  }

  await prisma.quizQuestion.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Quiz deleted",
  });
}