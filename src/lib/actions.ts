import type { z } from 'zod';
import { fieldErrors } from '@/lib/validation/auth';

/** Result of every Server Action (CLAUDE.md §4): never throw to the UI. */
export type ActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function ok<T>(data: T): ActionResult<T>;
export function ok(): ActionResult;
export function ok<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data };
}

export function fail(
  error: string,
  errors?: Record<string, string>,
): { ok: false; error: string; fieldErrors?: Record<string, string> } {
  return errors ? { ok: false, error, fieldErrors: errors } : { ok: false, error };
}

/** Turn a zod error into a form-level message plus per-field messages. */
export function invalid(error: z.ZodError) {
  return fail('Please check the highlighted fields.', fieldErrors(error));
}
