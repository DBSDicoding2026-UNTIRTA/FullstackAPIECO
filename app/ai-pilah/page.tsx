import type { Metadata } from "next";

import { AiPilahSidebar } from "@/components/ai-pilah/AiPilahSidebar";
import { AiPilahWorkspace } from "@/components/ai-pilah/AiPilahWorkspace";
import AppNavbar from "@/components/shared/AppNavbar";
import AppShell from "@/components/shared/AppShell";
import { translate } from "@/lib/i18n/dictionaries";
import { getGlobalSettingsForSession } from "@/lib/settings/server";
import { requireUser } from "@/lib/user-auth";

export const metadata: Metadata = {
  title: "AI Pilah | Pilah Yuk!!",
  description:
    "Asisten chat AI untuk tanya sampah, daur ulang, dan tips memilah secara singkat dan jelas.",
};

export default async function AiPilahPage() {
  const session = await requireUser({ adminRedirectTo: "/admin/ai-pilah" });
  const settings = await getGlobalSettingsForSession(session);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(settings.preferences.language, key, values);

  const navbarUser = {
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    role: session.user?.role ?? "USER",
  };

  const sidebarText = {
    title: t("aiPilah.sidebar.title"),
    newChat: t("aiPilah.sidebar.newChat"),
    empty: t("aiPilah.sidebar.empty"),
  };

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

  return (
    <AppShell variant="user">
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(236,253,245,0.96),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f7fffb_55%,#eefdf5_100%)] text-slate-900 dark:bg-slate-950 dark:text-white">
        <AppNavbar user={navbarUser} />

        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <AiPilahSidebar text={sidebarText} />
            <AiPilahWorkspace
              text={workspaceText}
              chatText={chatText}
              language={settings.preferences.language}
            />
          </div>
        </div>
      </main>
    </AppShell>
  );
}