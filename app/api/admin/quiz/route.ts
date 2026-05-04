import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const moduleSelect = {
  id: true,
  title: true,
  order: true,
} as const;

const quizInputSchema = z.object({
  moduleId: z.string().trim().min(1, "Modul wajib dipilih."),
  question: z.string().trim().min(1, "Pertanyaan wajib diisi."),
  optionA: z.string().trim().min(1, "Pilihan A wajib diisi."),
  optionB: z.string().trim().min(1, "Pilihan B wajib diisi."),
  optionC: z.string().trim().min(1, "Pilihan C wajib diisi."),
  optionD: z.string().trim().min(1, "Pilihan D wajib diisi."),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  points: z.coerce.number().int().min(1, "Poin minimal 1."),
});

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET() {
  const session = await checkAdmin();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const quizzes = await prisma.quizQuestion.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      moduleId: true,
      question: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      correctAnswer: true,
      points: true,
      createdAt: true,
      updatedAt: true,
      module: {
        select: moduleSelect,
      },
    },
  });

  return NextResponse.json(quizzes);
}

export async function POST(req: Request) {
  const session = await checkAdmin();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Format JSON tidak valid." },
      { status: 400 }
    );
  }

  const parsedBody = quizInputSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ?? "Data quiz belum lengkap.",
      },
      { status: 400 }
    );
  }

  const quizData = parsedBody.data;

  const moduleRecord = await prisma.quizModule.findFirst({
    where: {
      id: quizData.moduleId,
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

  const quiz = await prisma.quizQuestion.create({
    data: {
      moduleId: moduleRecord.id,
      question: quizData.question,
      optionA: quizData.optionA,
      optionB: quizData.optionB,
      optionC: quizData.optionC,
      optionD: quizData.optionD,
      correctAnswer: quizData.correctAnswer,
      points: quizData.points,
    },
    include: {
      module: {
        select: moduleSelect,
      },
    },
  });

  return NextResponse.json(quiz, { status: 201 });
}