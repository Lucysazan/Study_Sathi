import { z } from 'zod';

/**
 * Environment schemas (README "Environment variables"). Pure functions so they can be tested;
 * use `getClientEnv()` / `getServerEnv()` in app code.
 * With emulators on, everything has a safe local default, so `.env.local` only needs
 * NEXT_PUBLIC_USE_EMULATORS=true.
 */

export const EMULATOR_PROJECT_ID = 'demo-studysathi';

const flag = z
  .enum(['true', 'false'])
  .optional()
  .transform((v) => v === 'true');

const optionalText = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined));

const clientSchema = z
  .object({
    NEXT_PUBLIC_USE_EMULATORS: flag,
    NEXT_PUBLIC_FIREBASE_API_KEY: optionalText,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: optionalText,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: optionalText,
    NEXT_PUBLIC_FIREBASE_APP_ID: optionalText,
  })
  .transform((e, ctx) => {
    const useEmulators = e.NEXT_PUBLIC_USE_EMULATORS;
    const env = {
      useEmulators,
      apiKey: e.NEXT_PUBLIC_FIREBASE_API_KEY ?? (useEmulators ? 'demo-api-key' : undefined),
      authDomain: e.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? (useEmulators ? 'localhost' : undefined),
      projectId:
        e.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? (useEmulators ? EMULATOR_PROJECT_ID : undefined),
      appId: e.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    for (const [key, name] of [
      ['apiKey', 'NEXT_PUBLIC_FIREBASE_API_KEY'],
      ['authDomain', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
      ['projectId', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
    ] as const) {
      if (!env[key]) ctx.addIssue({ code: 'custom', message: `${name} is required`, path: [name] });
    }
    return env as {
      useEmulators: boolean;
      apiKey: string;
      authDomain: string;
      projectId: string;
      appId: string | undefined;
    };
  });

export type ClientEnv = z.output<typeof clientSchema>;

const serverSchema = z
  .object({
    NEXT_PUBLIC_USE_EMULATORS: flag,
    VERCEL_ENV: optionalText,
    FIREBASE_ADMIN_PROJECT_ID: optionalText,
    FIREBASE_ADMIN_CLIENT_EMAIL: optionalText,
    FIREBASE_ADMIN_PRIVATE_KEY: optionalText,
    SESSION_COOKIE_NAME: optionalText,
    STUDENT_LOGIN_DOMAIN: optionalText,
  })
  .transform((e, ctx) => {
    const useEmulators = e.NEXT_PUBLIC_USE_EMULATORS;
    if (useEmulators && e.VERCEL_ENV === 'production') {
      ctx.addIssue({
        code: 'custom',
        message: 'NEXT_PUBLIC_USE_EMULATORS must be false in production',
        path: ['NEXT_PUBLIC_USE_EMULATORS'],
      });
    }
    const credentials = useEmulators
      ? null
      : {
          projectId: e.FIREBASE_ADMIN_PROJECT_ID ?? '',
          clientEmail: e.FIREBASE_ADMIN_CLIENT_EMAIL ?? '',
          // Vercel stores the key with literal "\n"; turn them back into line breaks.
          privateKey: (e.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
        };
    if (credentials) {
      for (const [key, name] of [
        ['projectId', 'FIREBASE_ADMIN_PROJECT_ID'],
        ['clientEmail', 'FIREBASE_ADMIN_CLIENT_EMAIL'],
        ['privateKey', 'FIREBASE_ADMIN_PRIVATE_KEY'],
      ] as const) {
        if (!credentials[key]) {
          ctx.addIssue({ code: 'custom', message: `${name} is required`, path: [name] });
        }
      }
    }
    return {
      useEmulators,
      projectId: credentials?.projectId ?? EMULATOR_PROJECT_ID,
      credentials,
      sessionCookieName: e.SESSION_COOKIE_NAME ?? '__session',
      studentLoginDomain: (e.STUDENT_LOGIN_DOMAIN ?? 'students.studysathi.local').toLowerCase(),
    };
  });

export type ServerEnv = z.output<typeof serverSchema>;

function format(error: z.ZodError): string {
  return error.issues.map((i) => `- ${i.message}`).join('\n');
}

export function parseClientEnv(raw: Record<string, string | undefined>): ClientEnv {
  const result = clientSchema.safeParse(raw);
  if (!result.success) throw new Error(`Invalid Firebase client config:\n${format(result.error)}`);
  return result.data;
}

export function parseServerEnv(raw: Record<string, string | undefined>): ServerEnv {
  const result = serverSchema.safeParse(raw);
  if (!result.success) throw new Error(`Invalid server config:\n${format(result.error)}`);
  return result.data;
}
