import type { ZodError } from "zod";

export type SettingsFieldErrors = Record<string, string>;

export class SettingsActionError extends Error {
  readonly status: number;
  readonly fieldErrors?: SettingsFieldErrors;

  constructor(
    message: string,
    status = 400,
    fieldErrors?: SettingsFieldErrors,
  ) {
    super(message);
    this.name = "SettingsActionError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function createValidationError(error: ZodError) {
  const fieldErrors = error.issues.reduce<SettingsFieldErrors>((fields, issue) => {
    const field = issue.path[0];

    if (typeof field === "string" && !fields[field]) {
      fields[field] = issue.message;
    }

    return fields;
  }, {});

  return new SettingsActionError(
    error.issues[0]?.message ?? "Data pengaturan tidak valid.",
    400,
    fieldErrors,
  );
}

