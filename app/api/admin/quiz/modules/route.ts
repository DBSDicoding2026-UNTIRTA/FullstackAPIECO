import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const moduleInputSchema = z.object({
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
  order: z.coerce.number().int().min(1).default(1),
  xpReward: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { session: null, status: 401 as const };
  }

  if (session.user?.role !== "ADMIN") {
    return { session: null, status: 403 as const };
  }

  return { session, status: 200 as const };
}

export async function GET() {
  const auth = await checkAdmin();

  if (!auth.session) {
    return NextResponse.json(
      { message: auth.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: auth.status }
    );
  }

  const modules = await prisma.quizModule.findMany({
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      xpReward: true,
      isActive: true,
      _count: {
        select: {
          questions: true,
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
      isActive: moduleRecord.isActive,
      questionCount: moduleRecord._count.questions,
    }))
  );
}

export async function POST(req: Request) {
  const auth = await checkAdmin();

  if (!auth.session) {
    return NextResponse.json(
      { message: auth.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: auth.status }
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

  const parsedBody = moduleInputSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ?? "Data modul belum lengkap.",
      },
      { status: 400 }
    );
  }

  const moduleData = parsedBody.data;

  const existingModule = await prisma.quizModule.findUnique({
    where: {
      title: moduleData.title,
    },
    select: {
      id: true,
    },
  });

  if (existingModule) {
    return NextResponse.json(
      { message: "Judul modul sudah digunakan." },
      { status: 409 }
    );
  }

  const moduleRecord = await prisma.quizModule.create({
    data: {
      title: moduleData.title,
      description: moduleData.description,
      order: moduleData.order,
      xpReward: moduleData.xpReward,
      isActive: moduleData.isActive,
    },
  });

  return NextResponse.json(moduleRecord, { status: 201 });
}