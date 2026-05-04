import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type SessionUser = {
  id?: string;
  email?: string | null;
  role?: string | null;
};

type AnswerBody = {
  questionId?: unknown;
  selectedAnswer?: unknown;
};

const validAnswers = ["A", "B", "C", "D"] as const;

function isValidAnswer(value: unknown): value is "A" | "B" | "C" | "D" {
  return typeof value === "string" && validAnswers.includes(value as "A" | "B" | "C" | "D");
}

function calculateLevel(points: number) {
  return Math.floor(points / 100) + 1;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const sessionUser = session.user as SessionUser;

  if (sessionUser.role !== "USER") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const body = (await req.json().catch(() => null)) as AnswerBody | null;

  if (
    !body ||
    typeof body.questionId !== "string" ||
    !isValidAnswer(body.selectedAnswer)
  ) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const questionId = body.questionId;
  const selectedAnswer = body.selectedAnswer;

  const user =
    sessionUser.id
      ? await prisma.user.findUnique({
          where: {
            id: sessionUser.id,
          },
          select: {
            id: true,
            points: true,
          },
        })
      : sessionUser.email
        ? await prisma.user.findUnique({
            where: {
              email: sessionUser.email,
            },
            select: {
              id: true,
              points: true,
            },
          })
        : null;

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  const question = await prisma.quizQuestion.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
      correctAnswer: true,
      points: true,
    },
  });

  if (!question) {
    return NextResponse.json(
      { message: "Question not found" },
      { status: 404 }
    );
  }

  const isCorrect = selectedAnswer === question.correctAnswer;
  const pointsEarned = isCorrect ? question.points : 0;

  const result = await prisma.$transaction(async (tx) => {
    const currentUser = await tx.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        points: true,
        level: true,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const nextTotalPoints = isCorrect
      ? currentUser.points + pointsEarned
      : currentUser.points;
    const nextLevel = calculateLevel(nextTotalPoints);

    await tx.quizAttempt.create({
      data: {
        userId: user.id,
        questionId: question.id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        pointsEarned,
      },
    });

    if (!isCorrect) {
      return {
        totalPoints: currentUser.points,
        level: currentUser.level,
      };
    }

    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        points: nextTotalPoints,
        level: nextLevel,
      },
      select: {
        points: true,
        level: true,
      },
    });

    return {
      totalPoints: updatedUser.points,
      level: updatedUser.level,
    };
  });

  return NextResponse.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    pointsEarned,
    totalPoints: result.totalPoints,
    level: result.level,
  });
}