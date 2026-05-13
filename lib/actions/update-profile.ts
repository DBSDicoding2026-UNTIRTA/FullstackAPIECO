import "server-only";

import { z } from "zod";

import prisma from "@/lib/prisma";
import { createValidationError } from "@/lib/actions/settings-errors";

const MAX_AVATAR_LENGTH = 1_500_000;

function isValidAvatarValue(value: string) {
  if (value.length === 0) {
    return true;
  }

  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(80, "Nama maksimal 80 karakter."),
  avatar: z
    .string()
    .trim()
    .max(MAX_AVATAR_LENGTH, "Ukuran avatar terlalu besar.")
    .refine(isValidAvatarValue, "Avatar harus berupa URL atau file gambar.")
    .transform((value) => (value.length > 0 ? value : null)),
});

export type UpdateProfileInput = z.input<typeof updateProfileSchema>;

export async function updateProfile(userId: string, payload: unknown) {
  const parsedPayload = updateProfileSchema.safeParse(payload);

  if (!parsedPayload.success) {
    throw createValidationError(parsedPayload.error);
  }

  const { name, avatar } = parsedPayload.data;

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      avatar,
      image: avatar,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      bio: true,
      avatar: true,
      image: true,
      updatedAt: true,
    },
  });
}
