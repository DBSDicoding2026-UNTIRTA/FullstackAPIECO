import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminApi } from "@/lib/admin-api-auth";
import { prisma } from "@/lib/prisma";

const moduleSelect = {
  id: true,
  title: true,
  order: true,
} as const;

const quizUpdateSchema = z
  .object({
    moduleId: z.string().trim().min(1).optional(),
    question: z.string().trim().min(1).optional(),
    optionA: z.string().trim().min(1).optional(),
    optionB: z.string().trim().min(1).optional(),
    optionC: z.string().trim().min(1).optional(),
    optionD: z.string().trim().min(1).optional(),
    correctAnswer: z.enum(["A", "B", "C", "D"]).optional(),
    points: z.coerce.number().int().min(1).optional(),
  })
  .refine(
    (value) =>
      Object.values(value).some((field) => field !== undefined),
    {
      message: "Data update quiz belum lengkap.",
    }
  );

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Format JSON tidak valid." },
      { status: 400 }
    );
  }

  const parsedBody = quizUpdateSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ?? "Data update quiz belum lengkap.",
      },
      { status: 400 }
    );
  }

  const quizData = parsedBody.data;

  if (quizData.moduleId !== undefined) {
    const moduleRecord = await prisma.quizModule.findUnique({
      where: { id: quizData.moduleId },
      select: { id: true },
    });

    if (!moduleRecord) {
      return NextResponse.json(
        { message: "Modul tidak ditemukan." },
        { status: 404 }
      );
    }
  }

  const updatedQuiz = await prisma.quizQuestion.update({
    where: { id },
    data: {
      ...(quizData.moduleId !== undefined ? { moduleId: quizData.moduleId } : {}),
      ...(quizData.question !== undefined ? { question: quizData.question } : {}),
      ...(quizData.optionA !== undefined ? { optionA: quizData.optionA } : {}),
      ...(quizData.optionB !== undefined ? { optionB: quizData.optionB } : {}),
      ...(quizData.optionC !== undefined ? { optionC: quizData.optionC } : {}),
      ...(quizData.optionD !== undefined ? { optionD: quizData.optionD } : {}),
      ...(quizData.correctAnswer !== undefined
        ? { correctAnswer: quizData.correctAnswer }
        : {}),
      ...(quizData.points !== undefined ? { points: quizData.points } : {}),
    },
    include: {
      module: {
        select: moduleSelect,
      },
    },
  });

  return NextResponse.json(updatedQuiz);
}