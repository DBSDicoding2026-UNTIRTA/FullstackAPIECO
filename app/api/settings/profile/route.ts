import { NextResponse } from "next/server";

import { requireSettingsSession } from "@/lib/actions/settings-session";
import {
  readJsonPayload,
  settingsErrorResponse,
} from "@/lib/actions/settings-response";
import { updateProfile } from "@/lib/actions/update-profile";

export async function PATCH(request: Request) {
  try {
    const session = await requireSettingsSession();
    const payload = await readJsonPayload(request);
    const profile = await updateProfile(session.user.id, payload);

    return NextResponse.json({
      message: "Profil berhasil diperbarui.",
      profile,
    });
  } catch (error) {
    return settingsErrorResponse(error);
  }
}

