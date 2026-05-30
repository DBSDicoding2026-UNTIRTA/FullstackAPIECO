"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  BadgeHelp,
  BookOpen,
  Bug,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircleQuestion,
  Send,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { helpContent, type HelpContent } from "@/data/help";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface NeedHelpSheetProps {
  readonly trigger: ReactNode;
}

interface SupportIssuePayload {
  readonly title: string;
  readonly description: string;
}

interface SupportTicketResponse {
  readonly success?: boolean;
  readonly message?: string;
}

interface HelpSectionHeaderProps {
  readonly icon: LucideIcon;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

interface HelpInfoCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly children: ReactNode;
  readonly className?: string;
}

function HelpSectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: HelpSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}

function HelpInfoCard({ icon: Icon, title, children, className }: HelpInfoCardProps) {
  return (
    <Card
      className={cn(
        "gap-4 rounded-lg border-slate-200 bg-white/90 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90",
        className,
      )}
    >
      <CardHeader className="gap-0 px-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {children}
      </CardContent>
    </Card>
  );
}

async function submitSupportIssue(payload: SupportIssuePayload) {
  const response = await fetch("/api/support-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as SupportTicketResponse;

  if (!response.ok || data.success === false) {
    throw new Error(data.message ?? "Laporan gagal dikirim.");
  }

  return data;
}

function getContent(content: HelpContent, languageLabel: string) {
  return {
    guideEyebrow: languageLabel === "en" ? "Quick Start" : "Mulai Cepat",
    faqEyebrow: languageLabel === "en" ? "Common Questions" : "Bantuan Umum",
    contactEyebrow: languageLabel === "en" ? "Support Channel" : "Kanal Support",
    reportEyebrow: languageLabel === "en" ? "Issue Ticket" : "Tiket Masalah",
    formHint:
      languageLabel === "en"
        ? "Your report will be stored as a support ticket for the admin team."
        : "Laporan akan tersimpan sebagai support ticket untuk tim admin.",
    requiredHint:
      languageLabel === "en"
        ? "Title and description are required."
        : "Judul dan deskripsi wajib diisi.",
    teamEmpty:
      languageLabel === "en"
        ? "Team information is not available yet."
        : "Informasi tim belum tersedia.",
    visitRepository:
      languageLabel === "en" ? "Open GitHub repository" : "Buka repository GitHub",
    developerEmail: languageLabel === "en" ? "Developer email" : "Email Pengembang",
    content,
  };
}

export default function NeedHelpSheet({ trigger }: NeedHelpSheetProps) {
  const { language } = useSettings();
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const copy = useMemo(() => {
    const selectedLanguage = language === "en" ? "en" : "id";
    return getContent(helpContent[selectedLanguage], selectedLanguage);
  }, [language]);

  const canSubmit = issueTitle.trim().length > 0 && issueDescription.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      toast.error(copy.requiredHint);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitSupportIssue({
        title: issueTitle.trim(),
        description: issueDescription.trim(),
      });

      setHasSubmitted(true);
      setIssueTitle("");
      setIssueDescription("");
      toast.success(copy.content.report.successTitle, {
        description: copy.content.report.successDescription,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : language === "en"
            ? "Failed to send report."
            : "Laporan gagal dikirim.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-[calc(100%-1rem)] gap-0 overflow-hidden border-emerald-100 bg-slate-50/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-2xl dark:border-emerald-900/60 dark:bg-slate-950/95"
      >
        <SheetHeader className="border-b border-emerald-100/80 bg-white/85 px-5 py-5 pr-12 dark:border-emerald-900/50 dark:bg-slate-950/80">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-300">
              <LifeBuoy className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <SheetTitle className="text-xl font-semibold text-slate-950 dark:text-white">
                {copy.content.panelTitle}
              </SheetTitle>
              <SheetDescription className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {copy.content.panelDescription}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="guide" className="min-h-0 flex-1 gap-0">
          <div className="border-b border-emerald-100/80 bg-white/70 px-4 py-3 dark:border-emerald-900/50 dark:bg-slate-950/70">
            <TabsList className="grid h-auto w-full grid-cols-4 rounded-lg bg-emerald-50/80 p-1 dark:bg-emerald-950/30">
              <TabsTrigger value="guide" className="min-w-0 gap-1.5 rounded-md px-2 py-2 text-xs">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{copy.content.tabs.guide}</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="min-w-0 gap-1.5 rounded-md px-2 py-2 text-xs">
                <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{copy.content.tabs.faq}</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="min-w-0 gap-1.5 rounded-md px-2 py-2 text-xs">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{copy.content.tabs.contact}</span>
              </TabsTrigger>
              <TabsTrigger value="report" className="min-w-0 gap-1.5 rounded-md px-2 py-2 text-xs">
                <Bug className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{copy.content.tabs.report}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="guide" className="m-0 min-h-0 flex-1">
            <ScrollArea className="h-[calc(100dvh-12.5rem)]">
              <div className="px-5 py-5">
                <HelpSectionHeader
                  icon={BookOpen}
                  eyebrow={copy.guideEyebrow}
                  title={copy.content.guide.title}
                  description={copy.content.guide.description}
                />
                <div className="grid gap-3">
                  {copy.content.guide.items.map((item, index) => (
                    <Card
                      key={item.title}
                      className="gap-4 rounded-lg border-slate-200 bg-white py-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900"
                    >
                      <CardHeader className="px-4">
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            {index + 1}
                          </span>
                          <div>
                            <CardTitle className="text-sm font-semibold text-slate-950 dark:text-white">
                              {item.title}
                            </CardTitle>
                            <CardDescription className="mt-1 leading-6 text-slate-600 dark:text-slate-300">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4">
                        <ol className="space-y-2">
                          {item.steps.map((step) => (
                            <li key={step} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="faq" className="m-0 min-h-0 flex-1">
            <ScrollArea className="h-[calc(100dvh-12.5rem)]">
              <div className="px-5 py-5">
                <HelpSectionHeader
                  icon={MessageCircleQuestion}
                  eyebrow={copy.faqEyebrow}
                  title={copy.content.faq.title}
                  description={copy.content.faq.description}
                />
                <Card className="rounded-lg border-slate-200 bg-white py-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardContent className="px-4">
                    <Accordion type="single" collapsible defaultValue="faq-0">
                      {copy.content.faq.items.map((item, index) => (
                        <AccordionItem key={item.question} value={`faq-${index}`}>
                          <AccordionTrigger className="text-slate-900 hover:text-emerald-700 hover:no-underline dark:text-slate-100 dark:hover:text-emerald-300">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="leading-6 text-slate-600 dark:text-slate-300">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contact" className="m-0 min-h-0 flex-1">
            <ScrollArea className="h-[calc(100dvh-12.5rem)]">
              <div className="px-5 py-5">
                <HelpSectionHeader
                  icon={Mail}
                  eyebrow={copy.contactEyebrow}
                  title={copy.content.contact.teamTitle}
                  description={copy.content.contact.teamDescription}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <HelpInfoCard icon={Mail} title="Email">
                    <p className="font-medium text-emerald-700 dark:text-emerald-300">
                      {copy.content.contact.email}
                    </p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {copy.developerEmail}
                    </p>
                  </HelpInfoCard>
                  <HelpInfoCard icon={GitBranch} title="GitHub repository">
                    <a
                      href={copy.content.contact.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-medium text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
                    >
                      FullstackAPIECO
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {copy.visitRepository}
                    </p>
                  </HelpInfoCard>
                </div>

                <HelpInfoCard icon={Users} title={copy.content.contact.teamTitle} className="mt-3">
                  {copy.content.contact.members.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {copy.content.contact.members.map((member) => (
                        <div
                          key={member.id}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/50"
                        >
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {member.role}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{copy.teamEmpty}</p>
                  )}
                  <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.content.contact.responseTime}
                  </p>
                </HelpInfoCard>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="report" className="m-0 min-h-0 flex-1">
            <ScrollArea className="h-[calc(100dvh-12.5rem)]">
              <div className="px-5 py-5">
                <HelpSectionHeader
                  icon={Bug}
                  eyebrow={copy.reportEyebrow}
                  title={copy.content.report.title}
                  description={copy.content.report.description}
                />
                <Card className="rounded-lg border-slate-200 bg-white py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardContent className="px-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="help-issue-title">{copy.content.report.titleLabel}</Label>
                        <Input
                          id="help-issue-title"
                          value={issueTitle}
                          onChange={(event) => setIssueTitle(event.target.value)}
                          placeholder={copy.content.report.titlePlaceholder}
                          disabled={isSubmitting}
                          className="bg-white dark:bg-slate-950/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="help-issue-description">
                          {copy.content.report.descriptionLabel}
                        </Label>
                        <Textarea
                          id="help-issue-description"
                          value={issueDescription}
                          onChange={(event) => setIssueDescription(event.target.value)}
                          placeholder={copy.content.report.descriptionPlaceholder}
                          disabled={isSubmitting}
                          className="min-h-32 resize-none bg-white dark:bg-slate-950/40"
                        />
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {copy.formHint}
                        </p>
                        <Button
                          type="submit"
                          disabled={!canSubmit || isSubmitting}
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          {isSubmitting ? (
                            <AlertCircle className="h-4 w-4 animate-pulse" aria-hidden="true" />
                          ) : (
                            <Send className="h-4 w-4" aria-hidden="true" />
                          )}
                          {isSubmitting ? copy.content.report.submitting : copy.content.report.submit}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {!hasSubmitted && (
                  <Empty className="mt-3 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">
                        <BadgeHelp className="h-5 w-5" aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle className="text-sm text-slate-900 dark:text-slate-100">
                        {copy.content.report.emptyTitle}
                      </EmptyTitle>
                      <EmptyDescription>{copy.content.report.emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export function NeedHelpMobileButton() {
  const { t } = useSettings();

  return (
    <NeedHelpSheet
      trigger={
        <button
          type="button"
          aria-label={t("nav.help")}
          title={t("nav.help")}
          className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white/95 text-emerald-700 shadow-[0_14px_34px_rgba(16,185,129,0.22)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:border-emerald-900/70 dark:bg-slate-950/95 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
        >
          <HelpCircle className="h-5 w-5 transition group-hover:scale-105" aria-hidden="true" />
        </button>
      }
    />
  );
}
