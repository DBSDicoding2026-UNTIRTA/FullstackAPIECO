"use client";

import { Send } from "lucide-react";
import type { KeyboardEvent } from "react";

interface AiChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder: string;
  sendLabel: string;
  sendingLabel: string;
}

const MAX_CHARACTERS = 500; // Client-side limit for better UX

export function AiChatInput({
  value,
  onChange,
  onSend,
  isLoading,
  placeholder,
  sendLabel,
  sendingLabel,
}: AiChatInputProps) {
  const canSend = value.trim().length > 0 && !isLoading;
  const isNearLimit = value.length > MAX_CHARACTERS * 0.8;
  const isAtLimit = value.length >= MAX_CHARACTERS;

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (canSend) {
        onSend();
      }
    }
  };

  const handleChange = (newValue: string) => {
    // Allow input up to MAX_CHARACTERS
    if (newValue.length <= MAX_CHARACTERS) {
      onChange(newValue);
    }
  };

  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white/95 p-3 shadow-[0_16px_40px_rgba(16,185,129,0.08)] backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="sr-only">{placeholder}</span>
          <textarea
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={placeholder}
            className={`min-h-14 w-full resize-none rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 ${
              isAtLimit
                ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/40"
                : isNearLimit
                  ? "border-yellow-400 focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-900/40"
                  : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100 dark:border-emerald-900/40 dark:focus:ring-emerald-900/40"
            }`}
            disabled={isLoading}
          />
        </label>

        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(16,185,129,0.22)] transition hover:-translate-y-px hover:from-emerald-500 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isLoading ? sendingLabel : sendLabel}
          <Send className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">&nbsp;</p>
        <p
          className={`text-xs font-medium ${
            isAtLimit
              ? "text-red-500"
              : isNearLimit
                ? "text-yellow-600"
                : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {value.length}/{MAX_CHARACTERS}
        </p>
      </div>
    </div>
  );
}