import "server-only";

import bcrypt from "bcrypt";
import { z } from "zod";

import prisma from "@/lib/prisma";
import {
  SettingsActionError,
  createValidationError,
} from "@/lib/actions/settings-errors";

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi."),
    newPassword: z
      .string()
      .min(8, "Password baru minimal 8 karakter.")
      .max(128, "Password baru maksimal 128 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

export async function updatePassword(userId: string, payload: unknown) {
  const parsedPayload = updatePasswordSchema.safeParse(payload);

  if (!parsedPayload.success) {
    throw createValidationError(parsedPayload.error);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });

  if (!user) {
    throw new SettingsActionError("Akun tidak ditemukan.", 404);
  }

  if (!user.password) {
    throw new SettingsActionError(
      "Akun ini belum memiliki password credentials.",
      400,
      {
        currentPassword: "Login Google tidak memiliki password lokal.",
      },
    );
  }

  const passwordMatches = await bcrypt.compare(
    parsedPayload.data.currentPassword,
    user.password,
  );

  if (!passwordMatches) {
    throw new SettingsActionError("Password saat ini salah.", 400, {
      currentPassword: "Password saat ini salah.",
    });
  }

  const reusesCurrentPassword = await bcrypt.compare(
    parsedPayload.data.newPassword,
    user.password,
  );

  if (reusesCurrentPassword) {
    throw new SettingsActionError("Gunakan password baru yang berbeda.", 400, {
      newPassword: "Password baru harus berbeda dari password saat ini.",
    });
  }

  const hashedPassword = await bcrypt.hash(parsedPayload.data.newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    updatedAt: new Date().toISOString(),
  };
}

