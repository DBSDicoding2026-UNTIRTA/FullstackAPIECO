"use client";

interface AiTypingProps {
  readonly text: string;
}

export function AiTyping({ text }: AiTypingProps) {
  return (
    <div className="flex items-center gap-2 rounded-3xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900/70 dark:backdrop-blur-xl">
      <div className="flex items-center gap-1.5" aria-label={text}>
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500" />
      </div>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-300">{text}</span>
    </div>
  );
}