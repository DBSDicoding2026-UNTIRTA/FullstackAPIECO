import { NextResponse } from "next/server";

import { deleteAccount } from "@/lib/actions/delete-account";
import { requireSettingsSession } from "@/lib/actions/settings-session";
import {
  readJsonPayload,
  settingsErrorResponse,
} from "@/lib/actions/settings-response";

export async function DELETE(request: Request) {
  try {
    const session = await requireSettingsSession();
    const payload = await readJsonPayload(request);
    const result = await deleteAccount(session.user.id, payload);

    return NextResponse.json({
      message: "Akun berhasil dihapus.",
      result,
    });
  } catch (error) {
    return settingsErrorResponse(error);
  }
}

