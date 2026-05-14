"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/hooks/use-settings";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN";
  points: number;
  level: number;
  lastLoginAt: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsersApiResponse {
  users: AdminUser[];
  pagination: Pagination;
}

interface UserManagementClientProps {
  readonly adminId: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string | null): string {
  if (!name) return "PU";
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? "P"}${second?.[0] ?? "U"}`.toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function UserManagementClient({
  adminId,
}: UserManagementClientProps) {
  const { language, t } = useSettings();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locale = language === "en" ? "en-US" : "id-ID";

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [locale],
  );

  const formatDate = useCallback(
    (value: string) => dateFormatter.format(new Date(value)),
    [dateFormatter],
  );

  /* ---- Fetch users ---- */

  const fetchUsers = useCallback(
    async (page: number, query: string) => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
        });

        if (query.trim().length > 0) {
          params.set("search", query.trim());
        }

        const response = await fetch(`/api/admin/users?${params.toString()}`);
        const data = (await response.json()) as UsersApiResponse;

        if (!response.ok) {
          throw new Error("Failed to load users.");
        }

        setUsers(data.users);
        setPagination(data.pagination);
      } catch {
        toast.error("Gagal memuat data user.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void Promise.resolve().then(() => fetchUsers(1, search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Debounced search ---- */

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        void fetchUsers(1, value);
      }, 400);
    },
    [fetchUsers],
  );

  /* ---- Pagination ---- */

  const handlePage = useCallback(
    (page: number) => {
      void fetchUsers(page, search);
    },
    [fetchUsers, search],
  );

  /* ---- Change Role ---- */

  const handleRoleChange = useCallback(
    async (userId: string, newRole: "USER" | "ADMIN") => {
      if (userId === adminId) {
        toast.error(t("admin.users.cannotDemoteSelf"));
        return;
      }

      setBusyUserId(userId);

      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(data.message ?? "Failed.");
        }

        setUsers((current) =>
          current.map((u) =>
            u.id === userId ? { ...u, role: newRole } : u,
          ),
        );
        toast.success(t("admin.users.roleUpdated"));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal mengubah role.",
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [adminId, t],
  );

  /* ---- Delete User ---- */

  const handleDelete = useCallback(
    async (userId: string) => {
      if (userId === adminId) {
        toast.error(t("admin.users.cannotDeleteSelf"));
        return;
      }

      const confirmed = window.confirm(t("admin.users.deleteConfirm"));
      if (!confirmed) return;

      setBusyUserId(userId);

      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(data.message ?? "Failed.");
        }

        toast.success(t("admin.users.deleteSuccess"));
        void fetchUsers(pagination.page, search);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal menghapus user.",
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [adminId, fetchUsers, pagination.page, search, t],
  );

  /* ---- Render ---- */

  return (
    <>
      {/* Header */}
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(16,185,129,0.35)] transition-colors duration-300 sm:p-8 dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              {t("admin.users.title")}
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl dark:text-white">
              {t("admin.users.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
              {t("admin.users.subtitle")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              ADMIN
            </div>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              {t("admin.users.total", {
                count: pagination.total,
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Search + Table */}
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] transition-colors duration-300 dark:border-emerald-900/60 dark:bg-slate-900">
        {/* Search bar */}
        <div className="border-b border-emerald-100 px-5 py-4 dark:border-emerald-900/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("admin.users.search")}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/40 sm:max-w-sm"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("admin.users.empty")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    User
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    {t("admin.users.role")}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    {t("admin.users.points")}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    {t("admin.users.level")}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    {t("admin.users.joined")}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    {t("admin.users.lastLogin")}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                    {t("admin.users.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/40">
                {users.map((user) => {
                  const isSelf = user.id === adminId;
                  const isBusy = busyUserId === user.id;
                  const displayImage = user.avatar ?? user.image ?? null;

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
                    >
                      {/* User info */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-emerald-100 dark:border-emerald-900">
                            <AvatarImage
                              src={displayImage ?? undefined}
                              alt={user.name ?? "User"}
                            />
                            <AvatarFallback className="bg-emerald-50 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {user.name ?? "—"}
                              {isSelf && (
                                <span className="ml-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          }`}
                        >
                          {user.role === "ADMIN" && (
                            <ShieldCheck className="h-3 w-3" />
                          )}
                          {user.role}
                        </span>
                      </td>

                      {/* Points */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-center font-medium text-slate-700 dark:text-slate-300">
                        {user.points.toLocaleString()}
                      </td>

                      {/* Level */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-center font-medium text-slate-700 dark:text-slate-300">
                        {user.level}
                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-600 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Last Login */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-600 dark:text-slate-400">
                        {user.lastLoginAt
                          ? formatDate(user.lastLoginAt)
                          : t("admin.users.never")}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {/* Role toggle */}
                          <button
                            type="button"
                            disabled={isSelf || isBusy}
                            onClick={() =>
                              handleRoleChange(
                                user.id,
                                user.role === "ADMIN" ? "USER" : "ADMIN",
                              )
                            }
                            title={t("admin.users.changeRole")}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <UserCog className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={isSelf || isBusy}
                            onClick={() => handleDelete(user.id)}
                            title={t("admin.users.delete")}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-emerald-100 px-5 py-4 dark:border-emerald-900/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("admin.users.page", {
                current: pagination.page,
                total: pagination.totalPages,
              })}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => handlePage(pagination.page - 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePage(pagination.page + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
