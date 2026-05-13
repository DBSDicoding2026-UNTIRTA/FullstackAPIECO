"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Camera, ImagePlus, Loader2, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsSection from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/use-settings";
import type { SettingsFieldErrors, SettingsProfile } from "@/types/settings";

type ProfileField = keyof SettingsProfile;
type ProfileErrors = SettingsFieldErrors<ProfileField>;

interface ProfileSettingsProps {
  readonly profile: SettingsProfile;
}

interface ProfileApiResponse {
  message?: string;
  fieldErrors?: ProfileErrors;
  profile?: {
    name: string | null;
    username: string | null;
    email: string;
    phone: string | null;
    bio: string | null;
    avatar: string | null;
    image: string | null;
  };
}

const MAX_AVATAR_SIZE_BYTES = 900 * 1024;
const MAX_AVATAR_VALUE_LENGTH = 1_500_000;

function getInitials(name: string) {
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? "P"}${second?.[0] ?? "Y"}`.toUpperCase();
}

function isValidAvatarValue(value: string) {
  if (!value) return true;

  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateProfile(values: SettingsProfile): ProfileErrors {
  const errors: ProfileErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const avatar = values.avatar.trim();

  if (name.length < 2) {
    errors.name = "Nama minimal 2 karakter.";
  } else if (name.length > 80) {
    errors.name = "Nama maksimal 80 karakter.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email tidak valid.";
  } else if (email.length > 120) {
    errors.email = "Email maksimal 120 karakter.";
  }

  if (avatar.length > MAX_AVATAR_VALUE_LENGTH) {
    errors.avatar = "Ukuran avatar terlalu besar.";
  } else if (!isValidAvatarValue(avatar)) {
    errors.avatar = "Avatar harus berupa URL atau file gambar.";
  }

  return errors;
}

function hasErrors(errors: ProfileErrors) {
  return Object.keys(errors).length > 0;
}

function FieldError({ message }: { readonly message?: string }) {
  if (!message) return null;

  return <p className="text-xs font-medium text-rose-600">{message}</p>;
}

export default function ProfileSettings({ profile }: ProfileSettingsProps) {
  const router = useRouter();
  const { update } = useSession();
  const {
    profile: globalProfile,
    t,
    updateProfile: updateGlobalProfile,
  } = useSettings();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initialProfile = globalProfile.email ? globalProfile : profile;
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [form, setForm] = useState(initialProfile);
  const [touched, setTouched] = useState<Partial<Record<ProfileField, boolean>>>(
    {},
  );
  const [serverErrors, setServerErrors] = useState<ProfileErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientErrors = useMemo(() => validateProfile(form), [form]);
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedProfile),
    [form, savedProfile],
  );

  const updateField = (field: ProfileField, value: string) => {
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

  const getError = (field: ProfileField) => {
    if (!hasSubmitted && !touched[field]) {
      return undefined;
    }

    return clientErrors[field] ?? serverErrors[field];
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("settings.profile.errImage" as never));
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast.error(t("settings.profile.errSize" as never));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField("avatar", String(reader.result ?? ""));
    };

    reader.onerror = () => {
      toast.error(t("settings.profile.errRead" as never));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setServerErrors({});

    const errors = validateProfile(form);

    if (hasErrors(errors)) {
      toast.error(t("settings.profile.errValidate" as never));
      return;
    }

    setIsSubmitting(true);

    const previousProfile = globalProfile;
    updateGlobalProfile(form);

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          avatar: form.avatar,
        }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as ProfileApiResponse;

      if (!response.ok) {
        updateGlobalProfile(previousProfile);
        setServerErrors(result.fieldErrors ?? {});
        toast.error(result.message ?? t("settings.profile.errSave" as never));
        return;
      }

      const nextProfile: SettingsProfile = {
        name: result.profile?.name ?? form.name,
        username: result.profile?.username ?? "",
        email: result.profile?.email ?? form.email,
        phone: result.profile?.phone ?? "",
        bio: result.profile?.bio ?? "",
        avatar: result.profile?.avatar ?? result.profile?.image ?? "",
      };

      setSavedProfile(nextProfile);
      setForm(nextProfile);
      updateGlobalProfile(nextProfile);
      setTouched({});
      setHasSubmitted(false);
      toast.success(result.message ?? t("settings.profile.successSave" as never));
      await update();
      router.refresh();
    } catch {
      updateGlobalProfile(previousProfile);
      toast.error(t("settings.profile.errNetwork" as never));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsSection
      id="profile"
      title={t("settings.profileTitle")}
      description={t("settings.profileDescription")}
      icon={UserRound}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {t("settings.profile.note" as never)}
          </p>
          <Button
            type="submit"
            form="profile-settings-form"
            disabled={isSubmitting || hasErrors(clientErrors) || !isDirty}
            className="h-10 rounded-xl bg-emerald-600 px-4 text-white shadow-[0_12px_30px_-18px_rgba(5,150,105,0.9)] hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            {isSubmitting ? t("common.saving") : t("settings.saveProfile")}
          </Button>
        </div>
      }
    >
      <form
        id="profile-settings-form"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24 border-4 border-emerald-50 shadow-[0_18px_40px_-26px_rgba(16,185,129,0.65)]">
            <AvatarImage src={form.avatar || undefined} alt={form.name} />
            <AvatarFallback className="bg-emerald-50 text-xl font-semibold text-emerald-700">
              {getInitials(form.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 rounded-xl border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
              >
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                {t("settings.uploadAvatar")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => updateField("avatar", "")}
                className="h-10 rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                {t("settings.removeAvatar")}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-name">{t("settings.fullName")}</Label>
            <Input
              id="settings-name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              autoComplete="name"
              aria-invalid={Boolean(getError("name"))}
              className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-emerald-500 focus-visible:ring-emerald-200"
            />
            <FieldError message={getError("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-email">{t("settings.email")}</Label>
            <Input
              id="settings-email"
              type="email"
              value={form.email}
              disabled
              readOnly
              autoComplete="email"
              aria-invalid={Boolean(getError("email"))}
              className="h-11 rounded-xl border-slate-200 bg-slate-100 text-slate-600 opacity-100 disabled:cursor-not-allowed disabled:opacity-100 dark:bg-slate-800 dark:text-slate-300"
            />
            <FieldError message={getError("email")} />
          </div>
        </div>
      </form>
    </SettingsSection>
  );
}
