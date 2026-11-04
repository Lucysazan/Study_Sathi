import { z } from 'zod';

/** Form schemas for login and sign-up. Messages are shown to users: keep them short and kind. */

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Please enter a valid email address.'));

export const passwordSchema = z
  .string()
  .min(8, 'Please use at least 8 characters.')
  .max(128, 'Please use a shorter password.');

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter your name (at least 2 letters).')
  .max(60, 'Please use a shorter name (60 letters or fewer).');

/** Student usernames are chosen by a parent (Phase 3): lowercase letters, numbers, . _ - */
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9._-]{3,30}$/,
    'Usernames use 3–30 letters, numbers, dots, dashes or underscores.',
  );

export const accountTypeSchema = z.enum(['parent', 'creator'], {
  error: 'Please choose who the account is for.',
});

export const adultLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Please enter your password.'),
});

export const studentLoginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, 'Please enter your password.'),
});

export const signupSchema = z.object({
  accountType: accountTypeSchema,
  displayName: displayNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

/** Field → first error message, for showing errors next to each field. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
}

/** The synthetic email a student signs in with (never emailed). ARCHITECTURE §2. */
export function studentEmail(username: string, domain: string): string {
  return `${username.trim().toLowerCase()}@${domain}`;
}
