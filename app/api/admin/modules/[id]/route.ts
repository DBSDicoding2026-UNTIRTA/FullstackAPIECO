import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin-api-auth";
import {
  countQuizzesInModule,
  deleteQuizModule,
  findQuizModuleTitleOwner,
  getQuizModuleById,
  quizModuleInputSchema,
  updateQuizModule,
} from "@/lib/admin/quiz-modules";

type ModuleRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: ModuleRouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { message: "ID modul tidak valid." },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Format JSON tidak valid." },
      { status: 400 },
    );
  }

  const parsedBody = quizModuleInputSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ?? "Data modul belum lengkap.",
      },
      { status: 400 },
    );
  }

  try {
    const existingModule = await getQuizModuleById(id);

    if (!existingModule) {
      return NextResponse.json(
        { message: "Modul tidak ditemukan." },
        { status: 404 },
      );
    }

    const titleOwner = await findQuizModuleTitleOwner(parsedBody.data.title);

    if (titleOwner && titleOwner.id !== id) {
      return NextResponse.json(
        { message: "Judul modul sudah digunakan." },
        { status: 409 },
      );
    }

    const moduleRecord = await updateQuizModule(id, parsedBody.data);
    return NextResponse.json(moduleRecord);
  } catch {
    return NextResponse.json(
      { message: "Gagal memperbarui modul." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: ModuleRouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { message: "ID modul tidak valid." },
      { status: 400 },
    );
  }

  try {
    const existingModule = await getQuizModuleById(id);

    if (!existingModule) {
      return NextResponse.json(
        { message: "Modul tidak ditemukan." },
        { status: 404 },
      );
    }

    const quizCount = await countQuizzesInModule(id);

    if (quizCount > 0) {
      return NextResponse.json(
        {
          message:
            "Modul masih memiliki quiz. Pindahkan atau hapus quiz terlebih dahulu.",
        },
        { status: 409 },
      );
    }

    await deleteQuizModule(id);

    return NextResponse.json({
      message: "Modul berhasil dihapus.",
    });
  } catch {
    return NextResponse.json(
      { message: "Gagal menghapus modul." },
      { status: 500 },
    );
  }
}
