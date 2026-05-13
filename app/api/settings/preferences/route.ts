import { NextResponse } from "next/server";

import { requireSettingsSession } from "@/lib/actions/settings-session";
import {
  readJsonPayload,
  settingsErrorResponse,
} from "@/lib/actions/settings-response";
import { updatePreferences } from "@/lib/actions/update-preferences";

export async function PATCH(request: Request) {
  try {
    const session = await requireSettingsSession();
    const payload = await readJsonPayload(request);
    const preferences = await updatePreferences(session.user.id, payload);

    return NextResponse.json({
      message: "Preferensi berhasil disimpan.",
      preferences,
    });
  } catch (error) {
    return settingsErrorResponse(error);
  }
}

