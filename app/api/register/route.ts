import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

import prisma from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi."),
  email: z.string().trim().email("Email tidak valid."),
  age: z.number().int().min(1).max(120).nullable().optional(),
  password: z.string().min(1, "Password wajib diisi."),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsedPayload = registerSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          message: parsedPayload.error.issues[0]?.message ?? "Data register tidak valid.",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedPayload.data.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email sudah terdaftar. Silakan login.",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(parsedPayload.data.password, 10);

    await prisma.user.create({
      data: {
        name: parsedPayload.data.name,
        email: parsedPayload.data.email,
        age: parsedPayload.data.age ?? null,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Register berhasil.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat register.",
      },
      { status: 500 },
    );
  }
}