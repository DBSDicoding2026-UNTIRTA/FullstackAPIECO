import "server-only";

import { z } from "zod";

import prisma from "@/lib/prisma";

export const quizModuleInputSchema = z.object({
  title: z.string().trim().min(1, "Judul modul wajib diisi."),
  description: z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => {
      if (typeof value !== "string") {
        return null;
      }

      const description = value.trim();
      return description.length > 0 ? description : null;
    }),
  order: z.coerce.number().int().min(1, "Urutan modul minimal 1.").default(1),
  xpReward: z.coerce.number().int().min(0, "XP reward tidak boleh negatif.").default(0),
  isActive: z
    .preprocess((value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    }, z.boolean())
    .default(true),
});

export type QuizModuleInput = z.infer<typeof quizModuleInputSchema>;

const moduleSelect = {
  id: true,
  title: true,
  description: true,
  order: true,
  xpReward: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      quizzes: true,
    },
  },
} as const;

function toAdminQuizModule(moduleRecord: {
  id: string;
  title: string;
  description: string | null;
  order: number;
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    quizzes: number;
  };
}) {
  return {
    id: moduleRecord.id,
    title: moduleRecord.title,
    description: moduleRecord.description,
    order: moduleRecord.order,
    xpReward: moduleRecord.xpReward,
    isActive: moduleRecord.isActive,
    questionCount: moduleRecord._count.quizzes,
    createdAt: moduleRecord.createdAt,
    updatedAt: moduleRecord.updatedAt,
  };
}

export async function listAdminQuizModules() {
  const modules = await prisma.quizModule.findMany({
    orderBy: [
      {
        order: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: moduleSelect,
  });

  return modules.map(toAdminQuizModule);
}

export async function getQuizModuleById(id: string) {
  const moduleRecord = await prisma.quizModule.findUnique({
    where: {
      id,
    },
    select: moduleSelect,
  });

  return moduleRecord ? toAdminQuizModule(moduleRecord) : null;
}

export async function findQuizModuleTitleOwner(title: string) {
  return prisma.quizModule.findUnique({
    where: {
      title,
    },
    select: {
      id: true,
    },
  });
}

export async function createQuizModule(data: QuizModuleInput) {
  const moduleRecord = await prisma.quizModule.create({
    data: {
      title: data.title,
      description: data.description,
      order: data.order,
      xpReward: data.xpReward,
      isActive: data.isActive,
    },
    select: moduleSelect,
  });

  return toAdminQuizModule(moduleRecord);
}

export async function updateQuizModule(id: string, data: QuizModuleInput) {
  const moduleRecord = await prisma.quizModule.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      description: data.description,
      order: data.order,
      xpReward: data.xpReward,
      isActive: data.isActive,
    },
    select: moduleSelect,
  });

  return toAdminQuizModule(moduleRecord);
}

export async function countQuizzesInModule(id: string) {
  return prisma.quizQuestion.count({
    where: {
      moduleId: id,
    },
  });
}

export async function deleteQuizModule(id: string) {
  await prisma.quizModule.delete({
    where: {
      id,
    },
  });
}
