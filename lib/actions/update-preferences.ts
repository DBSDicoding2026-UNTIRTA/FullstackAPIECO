import "server-only";

import { z } from "zod";

import prisma from "@/lib/prisma";
import { createValidationError } from "@/lib/actions/settings-errors";

export const updatePreferencesSchema = z
  .object({
    theme: z
      .enum(["light", "dark", "system"], {
        message: "Tema tidak valid.",
      })
      .optional(),
    language: z
      .enum(["id", "en"], {
        message: "Bahasa tidak valid.",
      })
      .optional(),
  })
  .refine((preferences) => preferences.theme || preferences.language, {
    message: "Minimal satu preferensi harus dikirim.",
  });

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

export async function updatePreferences(userId: string, payload: unknown) {
  const parsedPayload = updatePreferencesSchema.safeParse(payload);

  if (!parsedPayload.success) {
    throw createValidationError(parsedPayload.error);
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: parsedPayload.data,
    select: {
      theme: true,
      language: true,
      updatedAt: true,
    },
  });
}
