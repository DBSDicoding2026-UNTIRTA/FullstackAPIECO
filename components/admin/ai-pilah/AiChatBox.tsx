"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Bot, Sparkles } from "lucide-react";
import gsap from "gsap";

import { AiChatInput } from "./AiChatInput";
import { AiChatMessage, type AiChatMessageData } from "./AiChatMessage";
import { AiTyping } from "./AiTyping";
import type { AiPilahChatText } from "./types";
import type { LanguagePreference } from "@/types/settings";

type AiChatRole = "user" | "assistant";

interface AiChatHistoryResponse {
  data: AiChatMessageData[];
}

interface AiChatReplyResponse {
  data: {
    reply: AiChatMessageData;
  };
}

function createLocalMessage(role: AiChatRole, content: string): AiChatMessageData {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function isChatMessageData(message: AiChatMessageData): message is AiChatMessageData {
  return message.role === "user" || message.role === "assistant";
}

interface AiChatBoxProps {
  readonly text: AiPilahChatText;
  readonly language: LanguagePreference;
}

export function AiChatBox({ text, language }: AiChatBoxProps) {
  const { status } = useSession();
  const shellRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const hasLoadedHistoryRef = useRef(false);
  const welcomeMessage: AiChatMessageData = useMemo(
    () => ({ id: "ai-pilah-welcome", role: "assistant", content: text.welcome, createdAt: "" }),
    [text.welcome]
  );

  const [messages, setMessages] = useState<AiChatMessageData[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";
  const isBusy = isLoadingHistory || isSending;

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    gsap.fromTo(
      shell,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length, isBusy]);

  useEffect(() => {
    if (!isAuthenticated || hasLoadedHistoryRef.current) {
      return;
    }

    hasLoadedHistoryRef.current = true;

    const loadHistory = async () => {
      setIsLoadingHistory(true);

      try {
        const response = await fetch("/api/ai-pilah?limit=50");

        if (!response.ok) {
          throw new Error("Gagal memuat riwayat chat");
        }

        const payload = (await response.json()) as AiChatHistoryResponse;

        if (Array.isArray(payload.data) && payload.data.length > 0) {
          setMessages((currentMessages) => {
            if (currentMessages.length > 1) {
              return currentMessages;
            }

            const history = payload.data.filter(isChatMessageData);
            return [welcomeMessage, ...history];
          });
        }
      } catch {
        setError(text.error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    void loadHistory();
  }, [isAuthenticated, text.error, welcomeMessage]);

  const handleSend = async () => {
    const content = input.trim();

    if (!content || isBusy) {
      return;
    }

    const userMessage = createLocalMessage("user", content);

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/ai-pilah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const payload = (await response.json()) as AiChatReplyResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Gagal mengirim chat");
      }

      const assistantMessage = payload.data?.reply;

      if (!assistantMessage) {
        throw new Error("Respons AI kosong");
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch {
      setError(text.error);
    } finally {
      setIsSending(false);
    }
  };

  const hasConversation = messages.length > 1;

  return (
    <section
      ref={shellRef}
      className="overflow-hidden rounded-[32px] border border-emerald-100/80 bg-white/90 shadow-[0_24px_80px_rgba(16,185,129,0.12)] backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-4 border-b border-emerald-50 bg-linear-to-r from-emerald-50/90 via-white to-white px-5 py-5 dark:border-emerald-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-200/70">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
              {text.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {text.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-emerald-700 shadow-sm dark:border-emerald-900/50 dark:bg-slate-950 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            {isAuthenticated ? text.welcome : text.emptySubtitle}
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
              {error}
            </div>
          )}

          <div className="max-h-[70vh] flex-1 overflow-y-auto rounded-[28px] border border-slate-100 bg-slate-50/70 p-4 scroll-smooth dark:border-emerald-900/50 dark:bg-slate-950 sm:p-5">
            <div className="space-y-4">
              {!hasConversation && !isLoadingHistory && (
                <div className="rounded-[28px] border border-dashed border-emerald-200 bg-white p-5 text-center shadow-sm dark:border-emerald-900/50 dark:bg-slate-900">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {text.emptyTitle}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {text.emptySubtitle}
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <AiChatMessage key={message.id} message={message} locale={language} />
              ))}

              {isSending && <AiTyping text={text.sending} />}
              <div ref={scrollAnchorRef} />
            </div>
          </div>

          <div className="mt-4">
            <AiChatInput
              value={input}
              onChange={setInput}
              onSend={() => {
                void handleSend();
              }}
              isLoading={isBusy}
              placeholder={text.placeholder}
              sendLabel={text.send}
              sendingLabel={text.sending}
            />
          </div>
        </div>

        <aside className="border-t border-emerald-50 bg-linear-to-b from-emerald-50/80 to-white px-5 py-5 dark:border-emerald-900/50 dark:from-slate-900 dark:to-slate-900 lg:border-l lg:border-t-0">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900/50 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                {text.title}
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  {text.subtitle}
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  {text.emptyTitle}
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  {text.emptySubtitle}
                </li>
              </ul>
            </div>

            <div className="rounded-[28px] bg-linear-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-[0_20px_40px_rgba(16,185,129,0.25)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50/80">
                {text.send}
              </p>
              <div className="mt-3 space-y-3 text-sm leading-6 text-emerald-50">
                <p>{text.placeholder}</p>
                <p>{text.emptySubtitle}</p>
                <p>{text.welcome}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}