import { isAxiosError } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

// DRF's 400 body is {"<field>": ["message", ...]} — the shape every form on
// this project maps onto react-hook-form's setError. Returns whether any
// field error was applied, so callers can fall back to a generic message.
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): boolean {
  if (!isAxiosError(error) || error.response?.status !== 400) {
    return false;
  }
  const data = error.response.data as Record<string, string[] | undefined>;
  let applied = false;
  for (const field of fields) {
    const message = data[field as string]?.[0];
    if (message) {
      setError(field, { message });
      applied = true;
    }
  }
  return applied;
}
