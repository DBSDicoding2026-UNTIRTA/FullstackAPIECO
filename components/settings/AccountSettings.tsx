"use client";

import { useMemo, useState, type FormEvent } from "react";
import { KeyRound, Loader2, LockKeyhole, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsSection from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/use-settings";
import type { SettingsFieldErrors } from "@/types/settings";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";
type PasswordForm = Record<PasswordField, string>;
type PasswordErrors = SettingsFieldErrors<PasswordField>;

interface AccountSettingsProps {
  readonly canChangePassword: boolean;
}

interface PasswordApiResponse {
  message?: string;
  fieldErrors?: PasswordErrors;
}

const initialForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function validatePassword(values: PasswordForm): PasswordErrors {
  const errors: PasswordErrors = {};

  if (!values.currentPassword) {
    errors.currentPassword = "Password saat ini wajib diisi.";
  }

  if (values.newPassword.length < 8) {
    errors.newPassword = "Password baru minimal 8 karakter.";
  } else if (values.newPassword.length > 128) {
    errors.newPassword = "Password baru maksimal 128 karakter.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password wajib diisi.";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password tidak cocok.";
  }

  return errors;
}

function hasErrors(errors: PasswordErrors) {
  return Object.keys(errors).length > 0;
}

function FieldError({ message }: { readonly message?: string }) {
  if (!message) return null;

  return <p className="text-xs font-medium text-rose-600">{message}</p>;
}

export default function AccountSettings({
  canChangePassword,
}: AccountSettingsProps) {
  const { t } = useSettings();
  const [form, setForm] = useState<PasswordForm>(initialForm);
  const [touched, setTouched] = useState<
    Partial<Record<PasswordField, boolean>>
  >({});
  const [serverErrors, setServerErrors] = useState<PasswordErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientErrors = useMemo(() => validatePassword(form), [form]);
  const isEmpty = Object.values(form).every((value) => value.length === 0);

  const updateField = (field: PasswordField, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
    setServerErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const getError = (field: PasswordField) => {
    if (!hasSubmitted && !touched[field]) {
      return undefined;
    }

    return clientErrors[field] ?? serverErrors[field];
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canChangePassword) {
      toast.error(t("settings.account.errGoogle" as never));
      return;
    }

    setHasSubmitted(true);
    setServerErrors({});

    const errors = validatePassword(form);

    if (hasErrors(errors)) {
      toast.error(t("settings.account.errValidate" as never));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as PasswordApiResponse;

      if (!response.ok) {
        setServerErrors(result.fieldErrors ?? {});
        toast.error(result.message ?? t("settings.account.errSave" as never));
        return;
      }

      setForm(initialForm);
      setTouched({});
      setHasSubmitted(false);
      toast.success(result.message ?? t("settings.account.successSave" as never));
    } catch {
      toast.error(t("settings.account.errNetwork" as never));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsSection
      id="account"
      title={t("settings.account")}
      description={t("settings.accountDescription")}
      icon={LockKeyhole}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {t("settings.accountDescription")}
          </p>
          <Button
            type="submit"
            form="account-settings-form"
            disabled={
              isSubmitting ||
              !canChangePassword ||
              hasErrors(clientErrors) ||
              isEmpty
            }
            className="h-10 rounded-xl bg-emerald-600 px-4 text-white shadow-[0_12px_30px_-18px_rgba(5,150,105,0.9)] hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            {isSubmitting ? t("common.saving") : t("settings.savePassword")}
          </Button>
        </div>
      }
    >
      {!canChangePassword ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Akun ini login lewat Google dan belum memiliki password credentials.
        </div>
      ) : null}

      <form
        id="account-settings-form"
        className="grid gap-4 md:grid-cols-3"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <Label htmlFor="current-password">
            {t("settings.currentPassword")}
          </Label>
          <Input
            id="current-password"
            type="password"
            value={form.currentPassword}
            onChange={(event) =>
              updateField("currentPassword", event.target.value)
            }
            autoComplete="current-password"
            disabled={!canChangePassword}
            aria-invalid={Boolean(getError("currentPassword"))}
            className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-emerald-500 focus-visible:ring-emerald-200"
          />
          <FieldError message={getError("currentPassword")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">{t("settings.newPassword")}</Label>
          <Input
            id="new-password"
            type="password"
            value={form.newPassword}
            onChange={(event) => updateField("newPassword", event.target.value)}
            autoComplete="new-password"
            disabled={!canChangePassword}
            aria-invalid={Boolean(getError("newPassword"))}
            className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-emerald-500 focus-visible:ring-emerald-200"
          />
          <FieldError message={getError("newPassword")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">
            {t("settings.confirmPassword")}
          </Label>
          <Input
            id="confirm-password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            autoComplete="new-password"
            disabled={!canChangePassword}
            aria-invalid={Boolean(getError("confirmPassword"))}
            className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-emerald-500 focus-visible:ring-emerald-200"
          />
          <FieldError message={getError("confirmPassword")} />
        </div>
      </form>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
        <KeyRound className="h-5 w-5 text-emerald-700" aria-hidden="true" />
        <p className="text-sm font-medium text-emerald-800">
          Minimum password adalah 8 karakter.
        </p>
      </div>
    </SettingsSection>
  );
}
