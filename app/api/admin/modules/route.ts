import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin-api-auth";
import {
  createQuizModule,
  findQuizModuleTitleOwner,
  listAdminQuizModules,
  quizModuleInputSchema,
} from "@/lib/admin/quiz-modules";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const modules = await listAdminQuizModules();
    return NextResponse.json(modules);
  } catch {
    return NextResponse.json(
      { message: "Gagal memuat daftar modul." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  let body: unknown;

  try {
    body = await req.json();
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
    const existingModule = await findQuizModuleTitleOwner(parsedBody.data.title);

    if (existingModule) {
      return NextResponse.json(
        { message: "Judul modul sudah digunakan." },
        { status: 409 },
      );
    }

    const moduleRecord = await createQuizModule(parsedBody.data);
    return NextResponse.json(moduleRecord, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Gagal membuat modul." },
      { status: 500 },
    );
  }
}
