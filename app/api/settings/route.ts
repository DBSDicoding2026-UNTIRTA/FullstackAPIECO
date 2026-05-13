import { NextResponse } from "next/server";

import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { requireSettingsSession } from "@/lib/actions/settings-session";
import { settingsErrorResponse } from "@/lib/actions/settings-response";

export async function GET() {
  try {
    const session = await requireSettingsSession();
    const settings = await getGlobalSettingsForSession(session);

    return NextResponse.json({
      settings,
    });
  } catch (error) {
    return settingsErrorResponse(error);
  }
}

