"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Inbox,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type TicketStatusFilter = TicketStatus | "ALL";

interface SupportTicketUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  avatar: string | null;
}

interface SupportTicket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  user: SupportTicketUser;
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TicketsApiResponse {
  tickets: SupportTicket[];
  stats: TicketStats;
  pagination: Pagination;
}

interface TicketUpdateResponse {
  message?: string;
  ticket?: SupportTicket;
}

const STATUS_OPTIONS: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function getInitials(name: string | null, email: string) {
  const source = name?.trim() || email;
  const [first, second] = source.split(/\s+/);
  return `${first?.[0] ?? "P"}${second?.[0] ?? "Y"}`.toUpperCase();
}

function getStatusStyle(status: TicketStatus) {
  const styles: Record<TicketStatus, string> = {
    OPEN:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
    IN_PROGRESS:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    RESOLVED:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    CLOSED:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
  };

  return styles[status];
}

function getCopy(language: string) {
  const isEnglish = language === "en";

  return {
    badge: isEnglish ? "Support Center" : "Pusat Support",
    title: isEnglish ? "Support Tickets" : "Support Tickets",
    subtitle: isEnglish
      ? "Review user issue reports, inspect ticket details, and update support progress."
      : "Tinjau laporan kendala pengguna, lihat detail ticket, dan perbarui progres support.",
    total: isEnglish ? "Total Ticket" : "Total Ticket",
    open: isEnglish ? "Open Ticket" : "Open Ticket",
    inProgress: isEnglish ? "In Progress" : "In Progress",
    resolved: isEnglish ? "Resolved" : "Resolved",
    search: isEnglish ? "Search title, description, user, or email..." : "Cari judul, deskripsi, pengguna, atau email...",
    status: isEnglish ? "Status" : "Status",
    allStatus: isEnglish ? "All status" : "Semua status",
    latest: isEnglish ? "Latest first" : "Terbaru",
    titleColumn: isEnglish ? "Title" : "Judul",
    userColumn: isEnglish ? "User" : "Pengguna",
    dateColumn: isEnglish ? "Date" : "Tanggal",
    actionColumn: isEnglish ? "Action" : "Aksi",
    detail: isEnglish ? "Ticket detail" : "Detail ticket",
    detailDescription: isEnglish
      ? "Full report information submitted by the user."
      : "Informasi lengkap laporan yang dikirim oleh pengguna.",
    reporter: isEnglish ? "Reporter" : "Pelapor",
    email: isEnglish ? "Email" : "Email",
    reportedAt: isEnglish ? "Reported at" : "Waktu laporan",
    updatedAt: isEnglish ? "Last updated" : "Terakhir diperbarui",
    description: isEnglish ? "Description" : "Deskripsi",
    loading: isEnglish ? "Loading support tickets..." : "Memuat support ticket...",
    empty: isEnglish ? "No support tickets found." : "Belum ada support ticket.",
    emptyHint: isEnglish
      ? "Tickets submitted from Need Help will appear here."
      : "Ticket dari form Need Help akan muncul di sini.",
    error: isEnglish ? "Failed to load support tickets." : "Gagal memuat support ticket.",
    updateSuccess: isEnglish ? "Ticket status updated." : "Status ticket berhasil diperbarui.",
    updateFailed: isEnglish ? "Failed to update status." : "Gagal memperbarui status.",
    page: isEnglish ? "Page" : "Halaman",
    of: isEnglish ? "of" : "dari",
    statuses: {
      OPEN: isEnglish ? "Open" : "Open",
      IN_PROGRESS: isEnglish ? "In Progress" : "In Progress",
      RESOLVED: isEnglish ? "Resolved" : "Resolved",
      CLOSED: isEnglish ? "Closed" : "Closed",
    } satisfies Record<TicketStatus, string>,
  };
}

function StatusBadge({
  status,
  label,
}: {
  readonly status: TicketStatus;
  readonly label: string;
}) {
  return (
    <Badge variant="outline" className={cn("rounded-full border px-2.5 py-1 font-semibold", getStatusStyle(status))}>
      {label}
    </Badge>
  );
}

export default function SupportTicketManagementClient() {
  const { language } = useSettings();
  const copy = useMemo(() => getCopy(language), [language]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatusFilter>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyTicketId, setBusyTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locale = language === "en" ? "en-US" : "id-ID";
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  const formatDate = useCallback(
    (value: string) => dateFormatter.format(new Date(value)),
    [dateFormatter],
  );

  const fetchTickets = useCallback(
    async (
      page: number,
      query: string,
      filter: TicketStatusFilter,
      options: { silent?: boolean } = {},
    ) => {
      if (!options.silent) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
          status: filter,
        });

        if (query.trim().length > 0) {
          params.set("search", query.trim());
        }

        const response = await fetch(`/api/admin/support-ticket?${params.toString()}`);
        const data = (await response.json()) as TicketsApiResponse;

        if (!response.ok) {
          throw new Error(copy.error);
        }

        setTickets(data.tickets);
        setStats(data.stats);
        setPagination(data.pagination);
        setSelectedTicket((current) => {
          if (!current) return current;
          return data.tickets.find((ticket) => ticket.id === current.id) ?? current;
        });
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : copy.error;
        setError(message);
        if (!options.silent) {
          toast.error(message);
        }
      } finally {
        if (!options.silent) {
          setIsLoading(false);
        }
      }
    },
    [copy.error],
  );

  useEffect(() => {
    void Promise.resolve().then(() => fetchTickets(1, "", "ALL"));
  }, [fetchTickets]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        void fetchTickets(1, value, statusFilter);
      }, 400);
    },
    [fetchTickets, statusFilter],
  );

  const handleStatusFilterChange = useCallback(
    (value: TicketStatusFilter) => {
      setStatusFilter(value);
      void fetchTickets(1, search, value);
    },
    [fetchTickets, search],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      void fetchTickets(page, search, statusFilter);
    },
    [fetchTickets, search, statusFilter],
  );

  const handleStatusChange = useCallback(
    async (ticketId: string, nextStatus: TicketStatus) => {
      setBusyTicketId(ticketId);

      try {
        const response = await fetch(`/api/admin/support-ticket/${ticketId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        });

        const data = (await response.json().catch(() => ({}))) as TicketUpdateResponse;

        if (!response.ok || !data.ticket) {
          throw new Error(data.message ?? copy.updateFailed);
        }

        setTickets((current) =>
          current.map((ticket) => (ticket.id === ticketId ? data.ticket! : ticket)),
        );
        setSelectedTicket((current) =>
          current?.id === ticketId ? data.ticket! : current,
        );
        toast.success(copy.updateSuccess);
        void fetchTickets(pagination.page, search, statusFilter, { silent: true });
      } catch (updateError) {
        toast.error(updateError instanceof Error ? updateError.message : copy.updateFailed);
      } finally {
        setBusyTicketId(null);
      }
    },
    [
      copy.updateFailed,
      copy.updateSuccess,
      fetchTickets,
      pagination.page,
      search,
      statusFilter,
    ],
  );

  const summaryCards = [
    {
      label: copy.total,
      value: stats.total,
      icon: TicketCheck,
      className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
    {
      label: copy.open,
      value: stats.open,
      icon: AlertCircle,
      className: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
    },
    {
      label: copy.inProgress,
      value: stats.inProgress,
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    },
    {
      label: copy.resolved,
      value: stats.resolved,
      icon: CheckCircle2,
      className: "bg-lime-50 text-lime-700 dark:bg-lime-950/50 dark:text-lime-300",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] transition-colors duration-300 sm:p-8 dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {copy.badge}
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl dark:text-white">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
              {copy.subtitle}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              ADMIN
            </div>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              {copy.latest}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.className)}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              {isLoading ? (
                <Skeleton className="mt-4 h-8 w-20" />
              ) : (
                <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight dark:text-white">
                  {card.value.toLocaleString(locale)}
                </p>
              )}
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
            </article>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] transition-colors duration-300 dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-emerald-100 px-5 py-4 dark:border-emerald-900/60 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={copy.search}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/40"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as TicketStatusFilter)}>
              <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white sm:w-44 dark:border-slate-700 dark:bg-slate-950">
                <SelectValue placeholder={copy.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{copy.allStatus}</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {copy.statuses[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="h-10 rounded-xl border-emerald-100 bg-emerald-50 px-3 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.latest}
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-emerald-700 dark:text-emerald-300">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
            <p className="text-sm font-medium">{copy.loading}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <AlertCircle className="h-10 w-10 text-rose-400" aria-hidden="true" />
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">{error}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void fetchTickets(pagination.page, search, statusFilter)}
            >
              Retry
            </Button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {copy.empty}
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {copy.emptyHint}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    {copy.titleColumn}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    {copy.userColumn}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    {copy.status}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    {copy.dateColumn}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                    {copy.actionColumn}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/40">
                {tickets.map((ticket) => {
                  const displayImage = ticket.user.avatar ?? ticket.user.image ?? null;
                  const isBusy = busyTicketId === ticket.id;

                  return (
                    <tr
                      key={ticket.id}
                      className="transition hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
                    >
                      <td className="min-w-72 px-5 py-3.5">
                        <p className="line-clamp-1 font-semibold text-slate-900 dark:text-white">
                          {ticket.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {ticket.description}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-emerald-100 dark:border-emerald-900">
                            <AvatarImage src={displayImage ?? undefined} alt={ticket.user.name ?? ticket.user.email} />
                            <AvatarFallback className="bg-emerald-50 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              {getInitials(ticket.user.name, ticket.user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {ticket.user.name ?? "PilahYuk User"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {ticket.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <Select
                          value={ticket.status}
                          disabled={isBusy}
                          onValueChange={(value) => void handleStatusChange(ticket.id, value as TicketStatus)}
                        >
                          <SelectTrigger className="h-9 w-38 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                            {isBusy ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                {copy.status}
                              </span>
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {copy.statuses[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-600 dark:text-slate-400">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setDetailOpen(true);
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
                            aria-label={copy.detail}
                            title={copy.detail}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-emerald-100 px-5 py-4 dark:border-emerald-900/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {copy.page} {pagination.page} {copy.of} {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </section>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-[calc(100%-1rem)] overflow-y-auto border-emerald-100 bg-white sm:max-w-xl dark:border-emerald-900/60 dark:bg-slate-950">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-slate-950 dark:text-white">
              {copy.detail}
            </SheetTitle>
            <SheetDescription className="text-slate-600 dark:text-slate-300">
              {copy.detailDescription}
            </SheetDescription>
          </SheetHeader>

          {selectedTicket && (
            <div className="space-y-4 px-4 pb-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={selectedTicket.status} label={copy.statuses[selectedTicket.status]} />
                  <Select
                    value={selectedTicket.status}
                    disabled={busyTicketId === selectedTicket.id}
                    onValueChange={(value) => void handleStatusChange(selectedTicket.id, value as TicketStatus)}
                  >
                    <SelectTrigger className="h-9 w-40 rounded-xl border-emerald-200 bg-white dark:border-emerald-900 dark:bg-slate-950">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {copy.statuses[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">
                  {selectedTicket.title}
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    <User className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.reporter}
                  </p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                    {selectedTicket.user.name ?? "PilahYuk User"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.email}
                  </p>
                  <p className="mt-2 break-all font-semibold text-slate-900 dark:text-slate-100">
                    {selectedTicket.user.email}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.reportedAt}
                  </p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.updatedAt}
                  </p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(selectedTicket.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {copy.description}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
                  {selectedTicket.description}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
