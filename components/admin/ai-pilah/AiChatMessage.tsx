"use client";

import { Bot, UserRound } from "lucide-react";
import type { LanguagePreference } from "@/types/settings";

type AiChatRole = "user" | "assistant";

export interface AiChatMessageData {
  id: string;
  role: AiChatRole;
  content: string;
  createdAt: string;
}

interface AiChatMessageProps {
  message: AiChatMessageData;
  locale: LanguagePreference;
}

function formatTime(createdAt: string, locale: LanguagePreference) {
  if (!createdAt) {
    return null;
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AiChatMessage({ message, locale }: AiChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const time = formatTime(message.createdAt, locale);

  return (
    <div
      className={`flex items-end gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
      data-chat-message
    >
      {isAssistant && (
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Bot className="h-5 w-5" />
        </div>
      )}

      <div
        className={`max-w-[88%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
          isAssistant
            ? "border border-emerald-100 bg-white text-slate-700 dark:border-emerald-900/50 dark:bg-slate-900 dark:text-slate-200"
            : "bg-linear-to-r from-emerald-600 to-emerald-500 text-white"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
        {time && (
          <p className={`mt-2 text-[11px] ${isAssistant ? "text-slate-400 dark:text-slate-500" : "text-emerald-50/80"}`}>
            {time}
          </p>
        )}
      </div>

      {!isAssistant && (
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
          <UserRound className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}