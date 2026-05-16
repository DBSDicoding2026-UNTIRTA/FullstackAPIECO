import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getUserDashboardData } from "@/lib/dashboard/server";
import { translate } from "@/lib/i18n/dictionaries";
import { getGlobalSettingsForSession } from "@/lib/settings/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user?.role !== "USER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!session.user.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const settings = await getGlobalSettingsForSession(session);
    const t = (
      key: Parameters<typeof translate>[1],
      values?: Record<string, string | number>,
    ) => translate(settings.preferences.language, key, values);
    const data = await getUserDashboardData({
      userId: session.user.id,
      fallbackName: session.user.name,
      t,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[USER_DASHBOARD_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
