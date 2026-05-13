"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsSection from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/use-settings";

interface DeleteAccountApiResponse {
  message?: string;
}

const REQUIRED_CONFIRMATION = "HAPUS AKUN";

export default function DangerZone() {
  const { t } = useSettings();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = confirmText === REQUIRED_CONFIRMATION && !isDeleting;

  const handleDeleteAccount = async () => {
    if (!canDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/settings/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmText,
        }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as DeleteAccountApiResponse;

      if (!response.ok) {
        toast.error(result.message ?? t("settings.dangerZone.error" as never));
        return;
      }

      toast.success(result.message ?? t("settings.dangerZone.success" as never));
      await signOut({
        callbackUrl: "/login",
      });
    } catch {
      toast.error(t("settings.dangerZone.networkError" as never));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SettingsSection
      id="danger-zone"
      title={t("settings.dangerZone")}
      description={t("settings.dangerZone.desc" as never)}
      icon={AlertTriangle}
      tone="danger"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950 dark:text-white">
            {t("settings.deleteAccount")}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {t("settings.dangerZone.warning" as never)}
          </p>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              className="h-10 rounded-xl bg-rose-600 px-4 text-white hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {t("settings.deleteAccount")}
            </Button>
          </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-rose-100 bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-slate-950">
                <AlertTriangle className="h-5 w-5 text-rose-600" aria-hidden="true" />
                {t("settings.dangerZone.dialogTitle" as never)}
              </AlertDialogTitle>
              <AlertDialogDescription className="leading-6 text-slate-600">
                {t("settings.dangerZone.dialogDesc" as never)}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                {t("settings.dangerZone.confirmLabel" as never)}
              </Label>
              <Input
                id="delete-confirmation"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                className="h-11 rounded-xl border-rose-200 bg-white focus-visible:border-rose-500 focus-visible:ring-rose-200"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting}
                onClick={() => {
                  setConfirmText("");
                }}
                className="rounded-xl"
              >
                {t("settings.dangerZone.cancel" as never)}
              </AlertDialogCancel>
              <Button
                type="button"
                disabled={!canDelete}
                onClick={handleDeleteAccount}
                className="h-10 rounded-xl bg-rose-600 px-4 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                )}
                {isDeleting ? t("settings.dangerZone.deleting" as never) : t("settings.dangerZone.deleteAction" as never)}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SettingsSection>
  );
}
