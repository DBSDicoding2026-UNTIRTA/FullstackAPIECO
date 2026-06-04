import type { Metadata } from "next";

import { AiPilahWorkspace } from "@/components/ai-pilah/AiPilahWorkspace";
import AppShell from "@/components/shared/AppShell";
import { requireAdmin } from "@/lib/admin-auth";
import { translate } from "@/lib/i18n/dictionaries";
import { getGlobalSettingsForSession } from "@/lib/settings/server";

export const metadata: Metadata = {
  title: "AI Pilah | Admin",
  description:
    "Asisten chat AI untuk tanya sampah, daur ulang, dan tips memilah secara singkat dan jelas.",
};

export default async function AdminAiPilahPage() {
  const session = await requireAdmin();
  const settings = await getGlobalSettingsForSession(session);

  const t = (
    key: Parameters<typeof translate>[1],
    values?: Record<string, string | number>,
  ) => translate(settings.preferences.language, key, values);

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
    <AppShell variant="admin">
      <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden text-slate-900 transition-colors duration-300 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(236,253,245,0.96),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f7fffb_55%,#eefdf5_100%)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_45%)] after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-[420px] after:w-[420px] after:-translate-x-1/2 after:rounded-full after:content-[''] after:bg-emerald-500/10 after:blur-3xl dark:text-white dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(5,150,105,0.08),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_45%,#020617_100%)] dark:before:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_45%)] dark:after:bg-emerald-500/10 md:min-h-[calc(100vh-4rem)]">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <AiPilahWorkspace
            text={workspaceText}
            chatText={chatText}
            language={settings.preferences.language}
          />
        </div>
      </div>
    </AppShell>
  );
}
