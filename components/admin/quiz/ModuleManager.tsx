"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookOpenText,
  Edit3,
  Loader2,
  PlusCircle,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import type { AdminQuizModule } from "./types";
import { modulesChangedEventName, quizChangedEventName } from "./events";

const emptyForm = {
  title: "",
  description: "",
  order: 1,
  xpReward: 0,
  isActive: true,
};

type ModuleFormState = typeof emptyForm;

async function fetchModules() {
  const res = await fetch("/api/admin/modules", {
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "Gagal memuat daftar modul.");
  }

  return (await res.json()) as AdminQuizModule[];
}

export default function ModuleManager() {
  const router = useRouter();

  const [modules, setModules] = useState<AdminQuizModule[]>([]);
  const [form, setForm] = useState<ModuleFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const sortedModules = useMemo(
    () =>
      [...modules].sort((first, second) => {
        if (first.order !== second.order) return first.order - second.order;
        return first.title.localeCompare(second.title);
      }),
    [modules],
  );

  useEffect(() => {
    let active = true;

    async function loadModules() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchModules();

        if (!active) return;

        setModules(data);
        setForm((current) => {
          if (editingId || current.title.trim().length > 0) {
            return current;
          }

          return {
            ...current,
            order: data.length + 1,
          };
        });
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat daftar modul.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadModules();

    return () => {
      active = false;
    };
  }, [refreshCount, editingId]);

  function updateForm<Key extends keyof ModuleFormState>(
    key: Key,
    value: ModuleFormState[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm(nextOrder = modules.length + 1) {
    setEditingId(null);
    setForm({
      ...emptyForm,
      order: Math.max(1, nextOrder),
    });
  }

  function notifyModuleChange() {
    window.dispatchEvent(new Event(modulesChangedEventName));
    window.dispatchEvent(new Event(quizChangedEventName));
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.title.trim().length === 0) {
      setError("Judul modul wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        editingId ? `/api/admin/modules/${editingId}` : "/api/admin/modules",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            order: form.order,
            xpReward: form.xpReward,
            isActive: form.isActive,
          }),
        },
      );

      const payload = (await res.json().catch(() => null)) as
        | AdminQuizModule
        | { message?: string }
        | null;

      if (!res.ok) {
        setError(
          payload && "message" in payload
            ? payload.message ?? "Gagal menyimpan modul."
            : "Gagal menyimpan modul.",
        );
        return;
      }

      resetForm(modules.length + (editingId ? 1 : 2));
      setSuccess(editingId ? "Modul berhasil diperbarui." : "Modul berhasil dibuat.");
      setRefreshCount((current) => current + 1);
      notifyModuleChange();
    } catch {
      setError("Terjadi gangguan saat menyimpan modul.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(moduleRecord: AdminQuizModule) {
    setError(null);
    setSuccess(null);
    setEditingId(moduleRecord.id);
    setForm({
      title: moduleRecord.title,
      description: moduleRecord.description ?? "",
      order: moduleRecord.order,
      xpReward: moduleRecord.xpReward,
      isActive: moduleRecord.isActive,
    });
  }

  async function handleDelete(moduleRecord: AdminQuizModule) {
    const confirmed = window.confirm(
      `Hapus modul "${moduleRecord.title}"? Modul yang masih punya quiz tidak akan bisa dihapus.`,
    );

    if (!confirmed) return;

    setDeletingId(moduleRecord.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/modules/${moduleRecord.id}`, {
        method: "DELETE",
      });

      const payload = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!res.ok) {
        setError(payload?.message ?? "Gagal menghapus modul.");
        return;
      }

      resetForm(Math.max(1, modules.length));
      setSuccess("Modul berhasil dihapus.");
      setRefreshCount((current) => current + 1);
      notifyModuleChange();
    } catch {
      setError("Terjadi gangguan saat menghapus modul.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.35)] dark:border-emerald-900/60 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black tracking-tight dark:text-white">
              Module Quiz
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Buat dan kelola module sebelum menambahkan pertanyaan quiz.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshCount((current) => current + 1)}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          <RefreshCw className="h-4 w-4" />
          {modules.length} Module
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30"
        >
          <div className="flex items-center gap-2">
            {editingId ? (
              <Edit3 className="h-4 w-4 text-emerald-600" />
            ) : (
              <PlusCircle className="h-4 w-4 text-emerald-600" />
            )}
            <h3 className="font-black text-slate-900 dark:text-white">
              {editingId ? "Edit Module" : "Buat Module"}
            </h3>
          </div>

          <div className="mt-4 grid gap-3">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Judul Module
              </label>
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                required
                placeholder="Contoh: Dasar Pemilahan Sampah"
                className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Deskripsi
              </label>
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="Ringkasan singkat isi module."
                className="mt-2 min-h-24 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Urutan
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(event) =>
                    updateForm("order", Math.max(1, Number(event.target.value)))
                  }
                  required
                  className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  XP Reward
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.xpReward}
                  onChange={(event) =>
                    updateForm("xpReward", Math.max(0, Number(event.target.value)))
                  }
                  required
                  className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Status
                </label>
                <label className="mt-2 flex h-12 items-center justify-between rounded-2xl border border-emerald-100 bg-white px-3 text-sm font-bold text-slate-700 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100">
                  Aktif
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => updateForm("isActive", event.target.checked)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                </label>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </div>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-300">
              {success}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Buat Module"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={() => resetForm()}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
                Batal
              </button>
            ) : null}
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-emerald-200 px-6 py-10 text-sm font-bold text-slate-500 dark:border-emerald-900/60 dark:text-slate-300">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
              Memuat module...
            </div>
          ) : sortedModules.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-300">
              <p className="font-black text-slate-900 dark:text-white">
                Belum ada module quiz.
              </p>
              <p className="mt-2">Buat module pertama agar dropdown quiz bisa digunakan.</p>
            </div>
          ) : (
            sortedModules.map((moduleRecord) => (
              <article
                key={moduleRecord.id}
                className="rounded-2xl border border-emerald-100 bg-white p-4 dark:border-emerald-900/60 dark:bg-slate-950"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Modul {moduleRecord.order}
                      </span>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                        {moduleRecord.questionCount} quiz
                      </span>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300">
                        +{moduleRecord.xpReward} XP
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {moduleRecord.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <h3 className="mt-3 font-black text-slate-900 dark:text-white">
                      {moduleRecord.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {moduleRecord.description ?? "Belum ada deskripsi modul."}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(moduleRecord)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300"
                      aria-label={`Edit ${moduleRecord.title}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(moduleRecord)}
                      disabled={deletingId === moduleRecord.id}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-950/30 dark:text-red-300"
                      aria-label={`Hapus ${moduleRecord.title}`}
                    >
                      {deletingId === moduleRecord.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
