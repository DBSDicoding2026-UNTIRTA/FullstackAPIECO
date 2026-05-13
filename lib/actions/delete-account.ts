import "server-only";

import { z } from "zod";

import prisma from "@/lib/prisma";
import {
  SettingsActionError,
  createValidationError,
} from "@/lib/actions/settings-errors";

const deleteAccountSchema = z.object({
  confirmText: z.literal("HAPUS AKUN", {
    message: "Ketik HAPUS AKUN untuk menghapus akun.",
  }),
});

export async function deleteAccount(userId: string, payload: unknown) {
  const parsedPayload = deleteAccountSchema.safeParse(payload);

  if (!parsedPayload.success) {
    throw createValidationError(parsedPayload.error);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new SettingsActionError("Akun tidak ditemukan.", 404);
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    deleted: true,
  };
}

