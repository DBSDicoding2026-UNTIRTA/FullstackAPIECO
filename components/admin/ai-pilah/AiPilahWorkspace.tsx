import type { LanguagePreference } from "@/types/settings";

import { AiChatBox } from "./AiChatBox";
import type { AiPilahChatText, AiPilahWorkspaceText } from "./types";

interface AiPilahWorkspaceProps {
  readonly text: AiPilahWorkspaceText;
  readonly chatText: AiPilahChatText;
  readonly language: LanguagePreference;
}

export function AiPilahWorkspace({ text, chatText, language }: AiPilahWorkspaceProps) {
  return (
    <div className="min-w-0 space-y-6">
      <section
        id="chat-ai"
        className="overflow-hidden rounded-[32px] border border-emerald-100/80 bg-white/85 shadow-[0_24px_80px_rgba(16,185,129,0.12)] backdrop-blur scroll-mt-24 dark:border-emerald-900/50 dark:bg-slate-900"
      >
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {text.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            {text.subtitle}
          </p>
          <p className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            {language.toUpperCase()}
          </p>

          <div className="mt-6">
            <AiChatBox text={chatText} language={language} />
          </div>
        </div>
      </section>
      <section id="riwayat-chat" className="sr-only" aria-hidden="true" />
    </div>
  );
}