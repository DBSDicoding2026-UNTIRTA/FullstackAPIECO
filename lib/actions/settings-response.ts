import { NextResponse } from "next/server";

import { SettingsActionError } from "@/lib/actions/settings-errors";

export async function readJsonPayload(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new SettingsActionError("Payload JSON tidak valid.", 400);
  }
}

export function settingsErrorResponse(error: unknown) {
  if (error instanceof SettingsActionError) {
    return NextResponse.json(
      {
        message: error.message,
        fieldErrors: error.fieldErrors,
      },
      { status: error.status },
    );
  }

  console.error("[SETTINGS_ERROR]", error);

  return NextResponse.json(
    {
      message: "Terjadi kesalahan saat menyimpan pengaturan.",
    },
    { status: 500 },
  );
}

