import type { Metadata } from "next";

import AiPilahHeader from "@/components/admin/ai-pilah/AiPilahHeader";
import AiPilahStats from "@/components/admin/ai-pilah/AiPilahStats";
import { AiPilahSidebar } from "@/components/admin/ai-pilah/AiPilahSidebar";
import { AiPilahWorkspace } from "@/components/admin/ai-pilah/AiPilahWorkspace";
import AppShell from "@/components/shared/AppShell";
import { translate } from "@/lib/i18n/dictionaries";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "AI Pilah — Admin",
  description:
    "Panel admin untuk memantau riwayat percakapan AI Pilah dan statistik terkait.",
};

export default async function AdminAiPilahPage() {
  const session = await requireAdmin();
  const settings = await getGlobalSettingsForSession(session);

  const t = (
    key: Parameters<typeof translate>[1],
    values?: Record<string, string | number>,
  ) => translate(settings.preferences.language, key, values);

  const sidebarText = {
    title: t("aiPilah.sidebar.title"),
    newChat: t("aiPilah.sidebar.newChat"),
    empty: t("aiPilah.sidebar.empty"),
  };

  const headerTitle = t("aiPilah.admin.title");
  const headerSubtitle = t("aiPilah.admin.subtitle");

  const workspaceText = {
    title: t("aiPilah.title"),
    subtitle: t("aiPilah.subtitle"),
  };

  const chatText = {
    title: t("aiPilah.title"),
    subtitle: t("aiPilah.subtitle"),
    welcome: t("aiPilah.welcome"),
    placeholder: t("aiPilah.placeholder"),
    send: t("aiPilah.send"),
    sending: t("aiPilah.sending"),
    emptyTitle: t("aiPilah.emptyTitle"),
    emptySubtitle: t("aiPilah.emptySubtitle"),
    error: t("aiPilah.error"),
  };

  /* ── Server-side stats ── */
  const totalChats = await prisma.aiChatMessage.count();

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const activeUsersRows = await prisma.aiChatMessage.findMany({
    where: { createdAt: { gte: since }, userId: { not: null } },
    select: { userId: true },
  });

  const activeUsers = new Set(activeUsersRows.map((r) => r.userId)).size;

  const latestMessages = await prisma.aiChatMessage.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { id: true, role: true, content: true, createdAt: true, userId: true },
  });

  const statsLabels = {
    totalChats: t("aiPilah.admin.totalChats"),
    activeUsers: t("aiPilah.admin.activeUsers"),
    latestMessages: t("aiPilah.admin.latestMessages"),
  };

  return (
    <AppShell variant="admin">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <AiPilahHeader title={headerTitle} subtitle={headerSubtitle} />

          <AiPilahStats
            totalChats={totalChats}
            activeUsers={activeUsers}
            latestMessagesCount={latestMessages.length}
            locale={settings.preferences.language}
            labels={statsLabels}
          />

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <AiPilahSidebar text={sidebarText} />
            <AiPilahWorkspace text={workspaceText} chatText={chatText} language={settings.preferences.language} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}