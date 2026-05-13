import { NextResponse } from "next/server";

import { requireSettingsSession } from "@/lib/actions/settings-session";
import {
  readJsonPayload,
  settingsErrorResponse,
} from "@/lib/actions/settings-response";
import { updatePassword } from "@/lib/actions/update-password";

export async function PATCH(request: Request) {
  try {
    const session = await requireSettingsSession();
    const payload = await readJsonPayload(request);
    const result = await updatePassword(session.user.id, payload);

    return NextResponse.json({
      message: "Password berhasil diperbarui.",
      result,
    });
  } catch (error) {
    return settingsErrorResponse(error);
  }
}

