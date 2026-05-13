"use client";

import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { AdminQuizModule } from "./types";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const allModulesValue = "__ALL_MODULES__";

type ModuleComboboxProps = {
  modules: AdminQuizModule[];
  value: string;
  onValueChange: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  includeAllOption?: boolean;
  allLabel?: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  loadingText: string;
  className?: string;
};

export default function ModuleCombobox({
  modules,
  value,
  onValueChange,
  loading = false,
  disabled = false,
  includeAllOption = false,
  allLabel = "All Modules",
  placeholder,
  searchPlaceholder,
  emptyText,
  loadingText,
  className,
}: ModuleComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedModule = useMemo(
    () => modules.find((moduleRecord) => moduleRecord.id === value) ?? null,
    [modules, value],
  );

  const triggerLabel =
    includeAllOption && value === allModulesValue
      ? allLabel
      : selectedModule
        ? `Modul ${selectedModule.order}: ${selectedModule.title}`
        : placeholder;

  const isDisabled = disabled || loading || (!includeAllOption && modules.length === 0);

  function handleSelect(nextValue: string) {
    onValueChange(nextValue);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn(
            "h-12 w-full justify-between rounded-2xl border-emerald-100 bg-white px-4 text-left text-sm font-semibold text-slate-800 shadow-none hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-emerald-950/30",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-emerald-600" />
            ) : (
              <Search className="h-4 w-4 shrink-0 text-emerald-600" />
            )}
            <span className="truncate">{loading ? loadingText : triggerLabel}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] rounded-2xl border-emerald-100 p-0 shadow-xl dark:border-emerald-900/60"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {includeAllOption ? (
                <CommandItem
                  value={allLabel}
                  onSelect={() => handleSelect(allModulesValue)}
                  className="rounded-xl"
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === allModulesValue ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="font-semibold">{allLabel}</span>
                </CommandItem>
              ) : null}

              {modules.map((moduleRecord) => (
                <CommandItem
                  key={moduleRecord.id}
                  value={`${moduleRecord.order} ${moduleRecord.title}`}
                  onSelect={() => handleSelect(moduleRecord.id)}
                  className="rounded-xl"
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === moduleRecord.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      Modul {moduleRecord.order}: {moduleRecord.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {moduleRecord.questionCount} quiz / {moduleRecord.xpReward} XP
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { allModulesValue };
