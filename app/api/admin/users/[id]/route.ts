import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminApi } from "@/lib/admin-api-auth";
import prisma from "@/lib/prisma";

const roleUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"], {
    message: "Role harus USER atau ADMIN.",
  }),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await params;
  const adminId = auth.session.user?.id;

  if (id === adminId) {
    return NextResponse.json(
      { message: "Tidak dapat mengubah role sendiri." },
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

  const parsed = roleUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Data tidak valid." },
      { status: 400 },
    );
  }

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!targetUser) {
    return NextResponse.json(
      { message: "User tidak ditemukan." },
      { status: 404 },
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json({
    message: `Role berhasil diubah menjadi ${updatedUser.role}.`,
    user: updatedUser,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await params;
  const adminId = auth.session.user?.id;

  if (id === adminId) {
    return NextResponse.json(
      { message: "Tidak dapat menghapus akun sendiri." },
      { status: 400 },
    );
  }

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });

  if (!targetUser) {
    return NextResponse.json(
      { message: "User tidak ditemukan." },
      { status: 404 },
    );
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({
    message: "User berhasil dihapus.",
  });
}
