import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
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
      moduleId: true,
      correctAnswer: true,
      points: true,
      module: {
        select: {
          xpReward: true,
        },
      },
    },
  });

  if (!question) {
    return NextResponse.json(
      { message: "Question not found" },
      { status: 404 }
    );
  }

  const isCorrect = selectedAnswer === question.correctAnswer;

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

    const previousCorrectAttempt = await tx.quizAttempt.findFirst({
      where: {
        userId: user.id,
        questionId: question.id,
        isCorrect: true,
      },
      select: {
        id: true,
      },
    });

    const correctModuleAttempts = await tx.quizAttempt.findMany({
      where: {
        userId: user.id,
        isCorrect: true,
        question: {
          moduleId: question.moduleId,
        },
      },
      distinct: ["questionId"],
      select: {
        questionId: true,
      },
    });

    const moduleQuestionCount = await tx.quizQuestion.count({
      where: {
        moduleId: question.moduleId,
      },
    });

    const correctQuestionIds = new Set(
      correctModuleAttempts.map((attempt) => attempt.questionId),
    );
    const wasModuleCompleted =
      moduleQuestionCount > 0 && correctQuestionIds.size >= moduleQuestionCount;

    const questionPointsEarned =
      isCorrect && !previousCorrectAttempt ? question.points : 0;

    if (isCorrect) {
      correctQuestionIds.add(question.id);
    }

    const isModuleCompleted =
      moduleQuestionCount > 0 && correctQuestionIds.size >= moduleQuestionCount;
    const moduleBonusEarned =
      isCorrect && !wasModuleCompleted && isModuleCompleted
        ? question.module.xpReward
        : 0;
    const totalPointsEarned = questionPointsEarned + moduleBonusEarned;
    const nextTotalPoints = currentUser.points + totalPointsEarned;
    const nextLevel = calculateLevel(nextTotalPoints);

    await tx.quizAttempt.create({
      data: {
        userId: user.id,
        questionId: question.id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        pointsEarned: totalPointsEarned,
      },
    });

    if (totalPointsEarned === 0) {
      return {
        totalPoints: currentUser.points,
        level: currentUser.level,
        pointsEarned: totalPointsEarned,
        questionPointsEarned,
        moduleBonusEarned,
        moduleCompleted: isModuleCompleted,
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
      pointsEarned: totalPointsEarned,
      questionPointsEarned,
      moduleBonusEarned,
      moduleCompleted: isModuleCompleted,
    };
  });

  if (result.pointsEarned > 0) {
    revalidatePath("/dashboard");
  }

  return NextResponse.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    pointsEarned: result.pointsEarned,
    questionPointsEarned: result.questionPointsEarned,
    moduleBonusEarned: result.moduleBonusEarned,
    moduleCompleted: result.moduleCompleted,
    totalPoints: result.totalPoints,
    level: result.level,
  });
}
